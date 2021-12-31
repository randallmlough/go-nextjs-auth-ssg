package middleware

import (
	"errors"
	"net/http"
	"strings"

	"github.com/randallmlough/nextjs-ssg-auth/user"

	"github.com/randallmlough/nextjs-ssg-auth/db"
	"github.com/randallmlough/nextjs-ssg-auth/json"
	"github.com/randallmlough/nextjs-ssg-auth/token"
	"github.com/randallmlough/nextjs-ssg-auth/validator"
)

func (srv Service) AuthenticateRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { // Add the "Vary: Authorization" header to the response. This indicates to any
		// caches that the response may vary based on the value of the Authorization
		// header in the request.
		w.Header().Add("Vary", "Authorization")

		// Retrieve the value of the Authorization header from the request. This will
		// return the empty string "" if there is no such header found.
		authorizationHeader := r.Header.Get("Authorization")

		// If there is no Authorization header found, add the AnonymousUser to the request context.
		if authorizationHeader == "" {
			r = user.ContextSetUser(r, user.AnonymousUser)
			next.ServeHTTP(w, r)
			return
		}

		// Otherwise, we expect the value of the Authorization header to be in the format
		// "Bearer <token>". We try to split this into its constituent parts, and if the
		// header isn't in the expected format we return a 401 Unauthorized response.
		headerParts := strings.Split(authorizationHeader, " ")
		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			json.InvalidAuthenticationTokenResponse(w, r)
			return
		}

		// Extract the actual authentication token from the header parts.
		t := headerParts[1]

		v := validator.New()

		// Validate the token to make sure it is in a sensible format.
		if token.ValidateTokenPlaintext(v, t); !v.Valid() {
			json.InvalidAuthenticationTokenResponse(w, r)
			return
		}

		// Retrieve the details of the user associated with the authentication token,
		// again calling the invalidAuthenticationTokenResponse if no
		// matching record was found. IMPORTANT: Notice that we are using
		// ScopeAuthentication as the scope here.
		u, err := srv.user.GetFromToken(token.ScopeAuthentication, t)
		if err != nil {
			switch {
			case errors.Is(err, db.ErrRecordNotFound):
				json.InvalidAuthenticationTokenResponse(w, r)
			default:
				json.ServerErrorResponse(w, r, err)
			}
			return
		}

		// add the user information to the request context.
		r = user.ContextSetUser(r, u)

		// Call the next handler in the chain.
		next.ServeHTTP(w, r)
	})

}

// AuthenticateAndRequire checks that a user is both authenticated except for these paths.
func (srv Service) AuthenticateAndRequire(next http.Handler) http.Handler {
	whitelistCheck := func(requireUser http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if methods, exist := srv.config.PublicPaths[r.URL.Path]; exist {
				if contains(methods, strings.ToLower(r.Method)) {
					next.ServeHTTP(w, r)
					return
				}
			}
			requireUser.ServeHTTP(w, r)
		})
	}
	return whitelistCheck(srv.AuthenticateRequest(RequireAuthenticatedUser(next)))
}
func contains(list []string, value string) bool {
	for _, v := range list {
		if value == v {
			return true
		}
	}
	return false
}

// RequireAuthenticatedUser checks that a user is authenticated.
func RequireAuthenticatedUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u := user.FromContext(r)

		if u.IsAnonymous() {
			json.AuthenticationRequiredResponse(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})
}

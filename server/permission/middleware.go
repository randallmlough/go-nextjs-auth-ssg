package permission

import (
	"net/http"

	"github.com/randallmlough/nextjs-ssg-auth/json"
	"github.com/randallmlough/nextjs-ssg-auth/user"
)

func (srv Service) RequirePermission(code Permission, next http.HandlerFunc) http.HandlerFunc {
	fn := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Retrieve the user from the request context.
		ctx := r.Context()
		u := user.FromContext(r)

		// Get the slice of permissions for the user.
		permissions, err := srv.GetAllForUser(ctx, srv.db, u.ID)
		if err != nil {
			json.ServerErrorResponse(w, r, err)
			return
		}

		// Check if the slice includes the required permission. If it doesn't, then
		// return a 403 Forbidden response.
		if !permissions.Include(code) {
			json.NotPermittedResponse(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})

	return fn
}

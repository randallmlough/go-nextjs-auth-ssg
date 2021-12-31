package api

import (
	"net/http"

	"github.com/randallmlough/nextjs-ssg-auth/auth"

	"github.com/randallmlough/nextjs-ssg-auth/json"
	"github.com/randallmlough/nextjs-ssg-auth/token"
	"github.com/randallmlough/nextjs-ssg-auth/user"
)

func (api *API) Logout(w http.ResponseWriter, r *http.Request) {
	u := user.FromContext(r)

	err := token.DeleteAllUserTokens(api.db, token.ScopeAuthentication, u.ID)
	if err != nil {
		json.ServerErrorResponse(w, r, err)
		return
	}
	auth.DeleteSessionCookie(w)
	// Send the user a confirmation message.
	env := json.Envelope{"message": "you've successfully logged out"}

	err = json.Write(w, http.StatusOK, env, nil)
	if err != nil {
		json.ServerErrorResponse(w, r, err)
	}
}

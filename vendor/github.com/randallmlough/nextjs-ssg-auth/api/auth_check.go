package api

import (
	"github.com/randallmlough/nextjs-ssg-auth/json"
	"github.com/randallmlough/nextjs-ssg-auth/user"
	"net/http"
)

func (api *API) AuthenticationCheck(w http.ResponseWriter, r *http.Request) {
	u := user.FromContext(r)

	env := json.Envelope{"user": u}

	err := json.Write(w, http.StatusOK, env, nil)
	if err != nil {
		json.ServerErrorResponse(w, r, err)
	}
}

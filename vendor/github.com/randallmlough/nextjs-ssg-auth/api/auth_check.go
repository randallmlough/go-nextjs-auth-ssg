package api

import (
	"github.com/randallmlough/nextjs-ssg-auth/json"
	"github.com/randallmlough/nextjs-ssg-auth/user"
	"net/http"
)

func (api *API) AuthenticationCheck(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	u := user.FromContext(r)

	permission, err := api.services.Permissions.GetAllForUser(ctx, api.db, u.ID)
	if err != nil {
		json.ServerErrorResponse(w, r, err)
	}

	env := json.Envelope{
		"user": u,
		"role": permission,
	}

	if err := json.Write(w, http.StatusOK, env, nil); err != nil {
		json.ServerErrorResponse(w, r, err)
	}
}

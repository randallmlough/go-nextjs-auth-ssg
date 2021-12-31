package api

import (
	"errors"
	"github.com/jackc/pgx/v4"
	"github.com/randallmlough/nextjs-ssg-auth/db"
	"net/http"
	"time"

	"github.com/randallmlough/nextjs-ssg-auth/auth"
	"github.com/randallmlough/nextjs-ssg-auth/json"

	"github.com/randallmlough/nextjs-ssg-auth/token"
	"github.com/randallmlough/nextjs-ssg-auth/user"
	"github.com/randallmlough/nextjs-ssg-auth/validator"
)

func (api *API) AuthenticationHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Parse the email and password from the request body.
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.Read(w, r, &input); err != nil {
		json.BadRequestResponse(w, r, err)
		return
	}

	// Validate the email and password provided by the frontend.
	v := validator.New()

	user.ValidateEmail(v, input.Email)
	user.ValidatePasswordPlaintext(v, input.Password)

	if !v.Valid() {
		json.FailedValidationResponse(w, r, v.Errors)
		return
	}

	var t *token.Token
	err := api.db.InTx(ctx, pgx.ReadCommitted, func(tx pgx.Tx) error {
		u, err := api.services.Users.GetByEmailInTx(ctx, tx, input.Email)
		if err != nil {
			switch {
			case errors.Is(err, db.ErrRecordNotFound):
				return ErrInvalidCredentials
			default:
				return err
			}
		}

		match, err := u.Password.Matches(input.Password)
		if err != nil {
			return err
		}

		if !match {
			return ErrInvalidCredentials
		}

		// if the password is correct, we generate a new token with a 24-hour
		// expiry time and the scope 'authentication'.
		t, err = token.New(tx, u.ID, 24*time.Hour, token.ScopeAuthentication)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		switch {
		case errors.Is(err, ErrInvalidCredentials):
			json.InvalidCredentialsResponse(w, r)
		default:
			json.ServerErrorResponse(w, r, err)
		}
		return
	}

	auth.SetSessionCookie(w, t.Plaintext)

	// Encode the token to JSON and send it in the response along with a 201 Created
	// status code.
	err = json.Write(w, http.StatusCreated, json.Envelope{"authentication_token": t}, nil)
	if err != nil {
		json.ServerErrorResponse(w, r, err)
	}
}

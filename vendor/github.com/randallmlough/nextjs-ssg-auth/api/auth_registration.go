package api

import (
	"errors"
	"fmt"
	"github.com/jackc/pgx/v4"
	"github.com/randallmlough/nextjs-ssg-auth/permission"
	"net/http"
	"time"

	"github.com/randallmlough/nextjs-ssg-auth/auth"
	"github.com/randallmlough/nextjs-ssg-auth/db"
	"github.com/randallmlough/nextjs-ssg-auth/json"
	"github.com/randallmlough/nextjs-ssg-auth/token"
	"github.com/randallmlough/nextjs-ssg-auth/user"
	"github.com/randallmlough/nextjs-ssg-auth/validator"
)

func (api *API) RegistrationHandler() http.HandlerFunc {

	var input struct {
		Name     string                `json:"name"`
		Email    string                `json:"email"`
		Password string                `json:"password"`
		Role     permission.Permission `json:"role"`
	}

	return func(w http.ResponseWriter, r *http.Request) {

		// Parse the request body into the request struct.
		if err := json.Read(w, r, &input); err != nil {
			json.BadRequestResponse(w, r, err)
			return
		}

		u := &user.User{
			Name:  input.Name,
			Email: input.Email,
		}

		// Use the Password.Set() method to generate and store the hashed and plaintext
		// passwords.
		if err := u.Password.Set(input.Password); err != nil {
			json.ServerErrorResponse(w, r, err)
			return
		}

		v := validator.New()

		v.Check(input.Role != "", "role", "must not be empty")
		v.Check(validator.In(string(input.Role), string(permission.CONTRIBUTOR), string(permission.RESTRICTED)), "role", "invalid permission")

		// Validate the user struct and return the error messages to the frontend if any of
		// the checks fail.
		if user.ValidateUser(v, u); !v.Valid() {
			json.FailedValidationResponse(w, r, v.Errors)
			return
		}
		ctx := r.Context()
		// Insert the user data into the database.
		err := api.db.InTx(ctx, pgx.ReadCommitted, func(tx pgx.Tx) error {
			if err := api.services.Users.RegisterUserInTx(ctx, tx, u); err != nil {
				return err
			}
			if err := api.services.Permissions.AddForUser(ctx, tx, u.ID, input.Role); err != nil {
				return err
			}
			// After the user record has been created in the database, generate a new authentication
			// token for the user.
			t, err := token.New(tx, u.ID, 3*24*time.Hour, token.ScopeAuthentication)
			if err != nil {
				fmt.Println("creating token error", err)
				return err
			}
			// set the authentication token in the response cookie
			auth.SetSessionCookie(w, t.Plaintext)
			return nil
		})
		if err != nil {
			switch {
			// If we get a ErrDuplicateEmail error, use the v.AddError() method to manually
			// add a message to the validator instance, and then call our
			// failedValidationResponse helper.
			case errors.Is(err, db.ErrDuplicateEmail):
				v.AddError("email", "a user with this email address already exists")
				json.FailedValidationResponse(w, r, v.Errors)
			default:
				json.ServerErrorResponse(w, r, err)
			}
			return
		}

		// Write a JSON response containing the user data along with a 201 Created status
		// code.
		env := json.Envelope{
			"user": u,
			"role": []permission.Permission{input.Role},
		}
		err = json.Write(w, http.StatusCreated, env, nil)
		if err != nil {
			json.ServerErrorResponse(w, r, err)
		}
	}
}

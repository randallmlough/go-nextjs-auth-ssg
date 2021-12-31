package user

import (
	"context"
	"net/http"
)

type contextKey string

const userContextKey = contextKey("user")

// ContextSetUser returns a new copy of the request with the provided User added to the context.
func ContextSetUser(r *http.Request, user *User) *http.Request {
	ctx := context.WithValue(r.Context(), userContextKey, user)
	return r.WithContext(ctx)
}

// FromContext retrieves the User struct from the request context. The only
// time that we'll use this helper is when we logically expect there to be User struct
// value in the context, and if it doesn't exist it will firmly be an 'unexpected' error, and therefore, panic.
func FromContext(r *http.Request) *User {
	user, ok := r.Context().Value(userContextKey).(*User)
	if !ok {
		panic("missing user value in request context")
	}

	return user
}

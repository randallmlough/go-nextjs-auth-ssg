package middleware

import (
	"fmt"
	"net/http"

	"github.com/randallmlough/nextjs-ssg-auth/json"
)

func RecoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Create a deferred function (which will always be run in the event of a panic
		// as Go unwinds the stack).
		defer func() {
			// Use the builtin recover function to check if there has been a panic or
			// not.
			if err := recover(); err != nil {
				// If there was a panic, set a "Connection: close" header on the
				// response. This acts as a trigger to make Go's HTTP server
				// automatically close the current connection after a response has been
				// sent.
				w.Header().Set("Connection", "close")
				// The value returned by recover() has the type interface{}, so we use
				// fmt.Errorf() to normalize it into an error and call our
				// serverErrorResponse() helper. In turn, this will log the error using
				// our custom Logger type at the ERROR level and send the frontend a 500
				// Internal Server Error response.
				json.ServerErrorResponse(w, r, fmt.Errorf("%s", fmt.Errorf("recovered from panic: %v", err)))
			}
		}()

		next.ServeHTTP(w, r)
	})
}

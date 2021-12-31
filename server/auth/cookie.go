package auth

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"
)

// SetSessionCookie is a cookie-based session.
func SetSessionCookie(w http.ResponseWriter, token string) {
	userCookie := http.Cookie{
		Name:     "session",
		Path:     "/",
		Value:    token,
		HttpOnly: true,
	}
	http.SetCookie(w, &userCookie)
}

// DeleteSessionCookie deletes the session cookie
func DeleteSessionCookie(w http.ResponseWriter) {
	userCookie := http.Cookie{
		Name:    "session",
		Path:    "/",
		Value:   "",
		Expires: time.Now(),
	}
	http.SetCookie(w, &userCookie)
}

// GetSessionCookie returns the session cookie from the request
func GetSessionCookie(r *http.Request) (string, error) {
	cookie, err := r.Cookie("session")
	if err != nil {
		return "", fmt.Errorf("failed to get session cookie: %w", err)
	}
	return cookie.Value, nil
}

// AuthCookie is a cookie-based authentication middleware.
func AuthCookie(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, err := GetSessionCookie(r)

		if err != nil {
			if !errors.Is(err, http.ErrNoCookie) {
				log.Printf("failed to get session cookie %w", err)
			}
			next.ServeHTTP(w, r)
			return
		}
		r.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))
		next.ServeHTTP(w, r)
	})
}

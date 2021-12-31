package api

import (
	"github.com/go-chi/chi/v5"
	chiMW "github.com/go-chi/chi/v5/middleware"
	"github.com/randallmlough/nextjs-ssg-auth/auth"
	"github.com/randallmlough/nextjs-ssg-auth/json"
	"github.com/randallmlough/nextjs-ssg-auth/middleware"
	"net/http"
	"path"
)

const (
	apiRoute   = "/api"
	apiVersion = "/v1"
)

var apiPath = path.Join(apiRoute, apiVersion)

func (api API) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(chiMW.RequestID)
	r.Use(chiMW.RealIP)
	r.Use(chiMW.Logger)
	r.Use(chiMW.Recoverer)
	r.NotFound(json.NotFoundResponse)
	r.MethodNotAllowed(json.MethodNotAllowedResponse)

	// resource RegisterRoutes
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message": "available"}`))
	})
	r.Mount("/auth", api.authRoutes())
	return r
}

func (api API) Middleware(r http.Handler) http.Handler {

	public := map[string][]string{
		"/api/v1/auth/register": {"post"},
		"/api/v1/auth/login":    {"post"},
		"/api/v1/health":        {"get"},
	}

	cfg := middleware.Config{
		PublicPaths: public,
	}
	mw := middleware.New(cfg, api.db, api.services.Users)
	return middleware.RecoverPanic(
		mw.EnableCORS(
			auth.AuthCookie(
				mw.AuthenticateAndRequire(r),
			),
		),
	)
}

func (api API) authRoutes() http.Handler {
	r := chi.NewRouter()
	r.Get("/check", api.AuthenticationCheck)
	r.Post("/register", api.RegistrationHandler())
	r.Post("/login", api.AuthenticationHandler)
	r.Delete("/logout", api.Logout)
	return r
}

package main

import (
	"context"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/randallmlough/nextjs-ssg-auth/api"
	"github.com/randallmlough/nextjs-ssg-auth/config"
	"github.com/randallmlough/nextjs-ssg-auth/db"
	"github.com/randallmlough/nextjs-ssg-auth/server"
	"log"
	"net/http"
	"strings"
)

func main() {
	cfg := config.New()
	r := chi.NewRouter()

	db, err := db.New(context.Background(), cfg.DB)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	api := api.New(cfg, db)
	r.Mount("/api/v1", api.RegisterRoutes())

	serverConfig := server.Config{
		Port:         cfg.Port,
		ReadTimeout:  0,
		WriteTimeout: 0,
		IdleTimeout:  0,
		Env:          cfg.Env,
	}
	PrintRoutes(r)
	if err := server.Serve(serverConfig, api.Middleware(r)); err != nil {
		log.Fatal(err)
	}
}

func PrintRoutes(r chi.Router) {
	walkFunc := func(method string, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
		route = strings.Replace(route, "/*/", "/", -1)
		fmt.Printf("%s %s\n", method, route)
		return nil
	}

	if err := chi.Walk(r, walkFunc); err != nil {
		fmt.Printf("Logging err: %s\n", err.Error())
	}
}

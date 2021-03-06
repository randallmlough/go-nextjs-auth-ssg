package server

import (
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
)

// FileServer conveniently sets up a http.FileServer handler to serve
// static files from a http.FileSystem.
func FileServer(r chi.Router, externalPath string, internalPath http.FileSystem) {
	if strings.ContainsAny(externalPath, "{}*") {
		panic("FileServer does not permit URL parameters.")
	}

	fs := http.StripPrefix(externalPath, http.FileServer(internalPath))

	if externalPath != "/" && externalPath[len(externalPath)-1] != '/' {
		r.Get(externalPath, http.RedirectHandler(externalPath+"/", 301).ServeHTTP)
		externalPath += "/"
	}
	externalPath += "*"

	r.Get(externalPath, func(w http.ResponseWriter, r *http.Request) {
		fs.ServeHTTP(w, r)
	})
}

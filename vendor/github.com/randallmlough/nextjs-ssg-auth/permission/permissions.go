package permission

import (
	"context"

	"github.com/randallmlough/nextjs-ssg-auth/db"
)

type Permission string

const (
	CONTRIBUTOR Permission = "CONTRIBUTOR"
	RESTRICTED  Permission = "RESTRICTED"
	ADMIN       Permission = "ADMIN"
)

// Permissions slice, which we will use to will hold the permission codes for a single user.
type Permissions []Permission

// Include checks whether the Permissions slice contains a specific permission code.
func (p Permissions) Include(code Permission) bool {
	for i := range p {
		if code == p[i] {
			return true
		}
	}
	return false
}

type Service struct {
	db *db.DB
}

// New returns a Permission Service interface.
func New(db *db.DB) Service {
	return Service{db}
}

func (srv Service) GetAllForUser(ctx context.Context, db db.Executor, userID int64) (Permissions, error) {
	return getAllForUser(db, userID)
}

func (srv Service) AddForUser(ctx context.Context, db db.Executor, userID int64, permissions ...Permission) error {
	return addForUser(db, userID, permissions...)
}

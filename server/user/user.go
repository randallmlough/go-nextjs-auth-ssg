package user

import (
	"context"
	"log"
	"time"

	"github.com/randallmlough/nextjs-ssg-auth/db"
)

var AnonymousUser = &User{}

type User struct {
	ID        int64     `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  password  `json:"-"`
	Version   int       `json:"-"`
}

func (u *User) IsAnonymous() bool {
	return u == AnonymousUser
}

type Service struct {
	db *db.DB
}

// New returns a User Service interface.
func New(db *db.DB) Service {
	return Service{db: db}
}

func (srv Service) RegisterUser(ctx context.Context, user *User) error {
	err := srv.RegisterUserInTx(ctx, srv.db, user)
	if err != nil {
		return err
	}
	return nil
}

func (srv Service) RegisterUserInTx(ctx context.Context, db db.Executor, user *User) error {
	log.Println("creating user", map[string]interface{}{
		"user":         user,
		"db-connected": db != nil,
	})
	return insert(db, user)
}

func (srv Service) GetByEmail(ctx context.Context, email string) (*User, error) {
	return srv.GetByEmailInTx(ctx, srv.db, email)
}
func (srv Service) GetByEmailInTx(ctx context.Context, db db.Executor, email string) (*User, error) {
	return getByEmail(db, email)
}

func (srv Service) Update(ctx context.Context, user *User) error {
	return srv.UpdateInTx(ctx, srv.db, user)
}

func (srv Service) UpdateInTx(ctx context.Context, db db.Executor, user *User) error {
	return update(db, user)
}

func (srv Service) GetFromToken(tokenScope, tokenPlaintext string) (*User, error) {
	return srv.GetFromTokenInTx(srv.db, tokenScope, tokenPlaintext)
}

func (srv Service) GetFromTokenInTx(db db.Executor, tokenScope, tokenPlaintext string) (*User, error) {
	return getForToken(db, tokenScope, tokenPlaintext)
}

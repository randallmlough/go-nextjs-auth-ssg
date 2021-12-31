package user

import (
	"context"
	"crypto/sha256"
	"errors"
	"time"

	"github.com/randallmlough/nextjs-ssg-auth/db"

	"github.com/jackc/pgx/v4"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgerrcode"
)

const (
	userEmailConstraint = "users_email_key"
)

func insert(exe db.Executor, user *User) error {
	query := `
        INSERT INTO users (name, email, password_hash) 
        VALUES ($1, $2, $3)
        RETURNING id, created_at, version`

	args := []interface{}{user.Name, user.Email, user.Password.hash}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// If the table already contains a record with this email address, then when we try
	// to perform the insert there will be a violation of the UNIQUE "users_email_key"
	// constraint that we set up in the previous chapter. We check for this error
	// specifically, and return custom ErrDuplicateEmail error instead.
	err := exe.QueryRow(ctx, query, args...).Scan(&user.ID, &user.CreatedAt, &user.Version)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case pgerrcode.UniqueViolation:
				switch pgErr.ConstraintName {
				case userEmailConstraint:
					return db.ErrDuplicateEmail
				}
			}
		} else {
			return err
		}
	}

	return nil
}

// getByEmail retrieves the User details from the database based on the user's email address.
func getByEmail(exe db.Executor, email string) (*User, error) {
	query := `
        SELECT id, created_at, name, email, password_hash, version
        FROM users
        WHERE email = $1`

	var user User

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := exe.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.CreatedAt,
		&user.Name,
		&user.Email,
		&user.Password.hash,
		&user.Version,
	)

	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, db.ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &user, nil
}

// update the details for a specific user. Notice that we check against the version
// field to help prevent any race conditions during the request cycle.
func update(exe db.Executor, user *User) error {
	query := `
        UPDATE users 
        SET name = $1, email = $2, version = version + 1
        WHERE id = $3 AND version = $4
        RETURNING version`

	args := []interface{}{
		user.Name,
		user.Email,
		user.ID,
		user.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := exe.QueryRow(ctx, query, args...).Scan(&user.Version)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "users_email_key"`:
			return db.ErrDuplicateEmail
		case errors.Is(err, pgx.ErrNoRows):
			return db.ErrEditConflict
		default:
			return err
		}
	}

	return nil
}

func getForToken(exe db.Executor, tokenScope, tokenPlaintext string) (*User, error) {
	// Calculate the SHA-256 hash of the plaintext token provided by the frontend.
	// Remember that this returns a byte *array* with length 32, not a slice.
	tokenHash := sha256.Sum256([]byte(tokenPlaintext))

	// Set up the SQL query.
	query := `
        SELECT users.id, users.created_at, users.name, users.email, users.password_hash, users.version
        FROM users
        INNER JOIN tokens
        ON users.id = tokens.user_id
        WHERE tokens.hash = $1
        AND tokens.scope = $2 
        AND tokens.expiry > $3`

	// Create a slice containing the query arguments. Notice how we use the [:] operator
	// to get a slice containing the token hash, rather than passing in the array (which
	// is not supported by the pq driver), and that we pass the current time as the
	// value to check against the token expiry.
	args := []interface{}{tokenHash[:], tokenScope, time.Now()}

	var user User

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Execute the query, scanning the return values into a User struct. If no matching
	// record is found we return an ErrRecordNotFound error.
	err := exe.QueryRow(ctx, query, args...).Scan(
		&user.ID,
		&user.CreatedAt,
		&user.Name,
		&user.Email,
		&user.Password.hash,
		&user.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, db.ErrRecordNotFound
		default:
			return nil, err
		}
	}

	// Return the matching user.
	return &user, nil
}

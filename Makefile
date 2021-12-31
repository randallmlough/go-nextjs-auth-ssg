# add environment variables
ifneq (,$(wildcard ./.env))
    include .env
endif

.PHONY: confirm
confirm:
	@echo -n 'Are you sure? [y/N] ' && read ans && [ $${ans:-N} = y ]

compose_file = ./.docker/docker-compose.yml

.PHONY: db/up
## db/up: start the dev database
db/up:
	- docker compose -f $(compose_file) -p nextjs up -d postgres

.PHONY: db/destroy
## db/destroy: destroy the local dev instance
db/destroy: confirm
	docker compose -f $(compose_file) down -v

.PHONY: migrate/up
## migrate/up: apply all up database migrations
migrate/up:
	migrate -path=./migrations -database=$(NEXTJS_DB_DSN) up

# ==================================================================================== #
# QUALITY CONTROL
# ==================================================================================== #

## audit: tidy dependencies and format, vet and test all code
.PHONY: audit
audit: vendor
	@echo 'Formatting code...'
	go fmt ./...
	@echo 'Vetting code...'
	go vet ./...

## vendor: tidy and vendor dependencies
.PHONY: vendor
vendor:
	@echo 'Tidying and verifying module dependencies...'
	go mod tidy
	go mod verify
	@echo 'Vendoring dependencies...'
	go mod vendor

# ==================================================================================== #
# BUILD
# ==================================================================================== #

## build/client: build the frontend site
FRONTEND_DIR=client
.PHONY: build/client
build/client:
	cd $(FRONTEND_DIR); \
	yarn install; \
 	yarn export

current_time = $(shell date +%Y%m%d%H%M%S)
git_description = $(shell git describe --always --dirty --tags --long)
linker_flags = '-s -X main.buildTime=${current_time} -X main.version=${git_description}'

## build/app: build the application
.PHONY: build/app
build/app: build/client audit
	@echo 'Building app'
	go build -ldflags=${linker_flags} -o=./bin/app ./app.go
	GOOS=linux GOARCH=amd64 go build -ldflags=${linker_flags} -o=./bin/linux_amd64/app ./app.go

# ==================================================================================== #
# PRODUCTION
# ==================================================================================== #

## production/connect: connect to the production server
.PHONY: production/connect
production/connect:
	ssh ${SSH_USER}@${PRODUCTION_HOST_IP}

## production/deploy/app: deploy the app to production
.PHONY: production/deploy/app
production/deploy/app: build/app
	rsync -P ./bin/linux_amd64/app ${SSH_USER}@${PRODUCTION_HOST_IP}:~
	rsync -rP --delete ./migrations ${SSH_USER}@${PRODUCTION_HOST_IP}:~
	rsync -P ./deploy/production/app.service ${SSH_USER}@${PRODUCTION_HOST_IP}:~
	rsync -P ./deploy/production/Caddyfile ${SSH_USER}@${PRODUCTION_HOST_IP}:~
	ssh -t ${SSH_USER}@${PRODUCTION_HOST_IP} ${SSH_FILE} '\
		migrate -path ~/migrations -database $$NEXTJS_DB_DSN up \
		&& sudo mv ~/app.service /etc/systemd/system/ \
		&& sudo systemctl enable app \
		&& sudo systemctl restart app \
		&& sudo mv ~/Caddyfile /etc/caddy/ \
		&& sudo systemctl reload caddy \
	'
	echo 'Deployed app to production'
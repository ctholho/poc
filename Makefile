# Self-Documenting Makefile Example
# Use `make help` to display help for each target.

.PHONY: dev
dev:  ## Start temporal dev cluster and watch server, external and worker
	@echo "Starting ..."
	temporal server start-dev --db-filename temporal-db --log-format pretty
	pnpm server.watch
	pnpm external.watch
	pnpm worker.watch


# State

This sample has a Workflow that maintains state in a `Map<string, number>`. The state can be updated and read via a Signal and Query:

[`src/workflows.ts`](./src/workflows.ts)

The Client scripts are:

- [`src/start-workflow.ts`](./src/start-workflow.ts)
- [`src/query-workflow.ts`](./src/query-workflow.ts)
- [`src/signal-workflow.ts`](./src/signal-workflow.ts)
- [`src/cancel-workflow.ts`](./src/cancel-workflow.ts)

### Running this sample

1. `temporal server start-dev` to start [Temporal Server](https://github.com/temporalio/cli/#installation).
1. `pnpm install` to install dependencies.
1. `pnpm run start.watch` to start the Worker.
1. In another shell, `pnpm run workflow.start` to run the Workflow.

Or run these to develop:
```
temporal server start-dev --db-filename temporal-db --log-format pretty
pnpm server.watch
pnpm external.watch
pnpm worker.watch
```

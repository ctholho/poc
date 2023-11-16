import { Client } from '@temporalio/client';
import express, { Request, Response } from 'express';
import http from 'http';
import { Server as WebSocketServer } from 'ws';
import { getValueQuery, setValueSignal, acceptSignal, rejectSignal } from './workflows';
import { aktenFluss } from './workflows';

const PORT = 3000;

const temporal = new Client(); // default temporal dev client
const app = express();
app.use(express.json());
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/** Query a signal of a running workflow */
app.get('/signal/:workflowId/:key', async (req: Request, res: Response) => {
  const handle = temporal.workflow.getHandle(req.params.workflowId);
  const result = await handle.query(getValueQuery, req.params.key);
  res.send(`Result is: ${JSON.stringify(result)}`);
});

/** Send a signal to a workflow */
app.post('/signal/:workflowId', async (req: Request, res: Response) => {
  const handle = temporal.workflow.getHandle(req.params.workflowId);

  for (const [key, value] of Object.entries(req.body)) {
    if (key === 'accept') {
      await handle.signal(acceptSignal);
    }
    else if (key === 'reject') {
      await handle.signal(rejectSignal);
    }
    else {
      await handle.signal(setValueSignal, key, value);
    }
  }

  res.send(`Sent data: ${JSON.stringify(req.body)}`);
});

/** Start a workflow */
app.post('/workflow/start/', triggerWorkflow);
app.post('/workflow/start/:workflowId', triggerWorkflow);
async function triggerWorkflow(req: Request, res: Response) {

  await temporal.workflow.start(aktenFluss, {
    taskQueue: 'akten',
    workflowId: req.params.workflowId,
    args: [req.body],
  });

  res.send(`Workflow ${req.params.workflowId} started. You can now signal, query, or cancel it.`);
};

/** Cancel a workflow */
app.post('/workflow/stop/:workflowId', async (req: Request, res: Response) => {
  await temporal.workflow.getHandle(req.params.workflowId).cancel();
  res.send(`Workflow ${req.params.workflowId} stopped.`);
});


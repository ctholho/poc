import { Client } from '@temporalio/client';
import { WorkflowExecutionAlreadyStartedError, WorkflowNotFoundError } from '@temporalio/workflow';
import express, { Request, Response } from 'express';
import http from 'http';
import { urlaubsAntrag, acceptSignal } from './workflows';

const PORT = 3000;

const temporal = new Client(); // default temporal dev client
const app = express();
app.use(express.json());
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// /** Query a signal of a running workflow */
// app.search('/state', async (req: Request, res: Response) => {
//   try {
//     const handle = temporal.workflow.getHandle(req.body.email);
//     const result = await handle.query(getValueQuery);
//     res.send(`Result is: ${JSON.stringify(result)}`);
//   }
//   catch (err) {
//     if (err instanceof WorkflowNotFoundError) {
//       return res.status(404).send('Urlaubsantrag nicht gefunden.')
//     } else {
//       return res.status(500).send('Server error.')
//     }
//   }
// })
//
// /** Query a signal of a running workflow */
// app.post('/state', async (req: Request, res: Response) => {
//   try {
//     const { email, ...newState } = req.body;
//
//     const handle = temporal.workflow.getHandle(email);
//     const result = await handle.signal(setValueSignal, newState);
//
//     res.send(`You added some info to your Urlaubsantrag: ${JSON.stringify(result)}`);
//   }
//   catch (err) {
//     if (err instanceof WorkflowNotFoundError) {
//       return res.status(404).send('Urlaubsantrag nicht gefunden.')
//     } else {
//       return res.status(500).send('Server error.')
//     }
//   }
// });
//
/** Approve a Urlaubsantrag */
app.post('/approve', async (req: Request, res: Response) => {
  try {
    const handle = temporal.workflow.getHandle(req.body.email);
    await handle.signal(acceptSignal);
    res.send(`Du hast den Urlaubsantrag für "${req.body.email}" bestätigt.`);
  }
  catch (err) {
    if (err instanceof WorkflowNotFoundError) {
      return res.status(404).send('Urlaubsantrag nicht gefunden.')
    } else {
      return res.status(500).send('Server error.')
    }
  }
});

/** Register a new Urlaubsantrag */
app.post('/antrag', async (req: Request, res: Response) => {

  try {
    await temporal.workflow.start(urlaubsAntrag, {
      taskQueue: 'MUTTI',
      workflowId: req.body.email,
      args: [req.body],
    });
  }
  catch (err) {
    if (err instanceof WorkflowExecutionAlreadyStartedError) {
      return res.status(400).send('Du hast schon einen Antrag laufen.');
    } else {
      throw err;
    }
  }

  res.send(`Urlaub für alle. ${req.body.email.split('@')[0]}, wir werden deinen Antrag gewissenhaft prüfen.`);
});

// /** Cancel a Urlaubsantrag */
// app.post('/stop', async (req: Request, res: Response) => {
//   await temporal.workflow.getHandle(req.body.email).cancel();
//   res.send(`Du (${req.body.email}) hast den Urlaubsantrag abgesagt.`);
// });


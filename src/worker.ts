import { Worker } from '@temporalio/worker';
import { createActivities } from './activities';

const SERVER = 'http://localhost:3001';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    taskQueue: '🤡-important-stuff',
    activities: createActivities(SERVER),
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

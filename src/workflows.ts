import * as wf from '@temporalio/workflow';
import type * as activities from './activities';
import { plusOne } from './helperWorkflow';

export const acceptSignal = wf.defineSignal('accept');
export const stateQuery = wf.defineQuery('state');

const { sendMails, urlaubAbsagen, urlaubBestaetigen, urlaubEintragen } = wf.proxyActivities<typeof activities>({
  startToCloseTimeout: '10s',
});

// FIXME:
// const { urlaubEintragen } = wf.proxyActivities<typeof activities>({
//   startToCloseTimeout: '100 hours',
//   retry: {
//     nonRetryableErrorTypes: ['AnnualLeaveExceededError']
//   }
// });

export async function urlaubsAntrag(input: any): Promise<void> {
  // FIXME:
  // const state = { ...input };
  // wf.setHandler(stateQuery, () => '🤡 ' + state?.reason?.toUpperCase() + ' ' + plusOne(2));

  const { email } = input;
  await urlaubEintragen(email);

  const userInteraction = new wf.Trigger<boolean>();
  wf.setHandler(acceptSignal, () => userInteraction.resolve(true));
  // const accepted = await userInteraction;
  const accepted = await Promise.race([userInteraction, wf.sleep('100 seconds').then(() => false)])

  if (accepted) {
    await urlaubBestaetigen(email)
    await sendMails([email], { subject: 'Urlaub genehmigt', text: '😎' })
  }
  else {
    await urlaubAbsagen(email)
    await sendMails([email], { subject: 'Urlaub nicht genehmigt', text: '😭' })
  }
}


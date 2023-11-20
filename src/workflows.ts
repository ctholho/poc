import * as wf from '@temporalio/workflow';
import { Duration } from '@temporalio/common';
import type * as activities from './activities';

export const acceptSignal = wf.defineSignal('accept');

const { sendMails, urlaubAbsagen, urlaubEintragen, urlaubBestaetigen } = wf.proxyActivities<typeof activities>({
  startToCloseTimeout: '100 hours',
});

export async function urlaubsAntrag(input: any): Promise<void> {
  const { email } = input;
  await urlaubEintragen(email);

  const userInteraction = new wf.Trigger<boolean>();
  wf.setHandler(acceptSignal, () => userInteraction.resolve(true));
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


// export async function urlaubsAntrag(input: string): Promise<void> {
//   const email = wf.workflowInfo().workflowId;
//   await urlaubEintragen(email);
//
//   const userInteraction = new wf.Trigger<boolean>();
//   wf.setHandler(acceptSignal, () => userInteraction.resolve(true));
//   const accepted = await Promise.race([userInteraction, wf.sleep('100 seconds').then(() => false)])
//
//   if (accepted) {
//     await urlaubBestaetigen(email);
//     await sendMails([email], { subject: 'Urlaubsantrag', text: `Hi ${email.split('@')[0]},\n Viel Spaß im Urlaub! ` })
//   }
//   else {
//     await urlaubAbsagen(email);
//     throw new wf.ApplicationFailure('Nicht akzeptiert.')
//   }
// }
//
// export async function waitOnUser(timeout: Duration): Promise<boolean> {
//   const userInteraction = new wf.Trigger<boolean>();
//   wf.setHandler(acceptSignal, () => userInteraction.resolve(true));
//
//   return await Promise.race([userInteraction, wf.sleep(timeout).then(() => false)]);
// }
//

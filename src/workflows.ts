import { CancellationScope, defineSignal, setHandler, defineQuery, proxyActivities, sleep } from '@temporalio/workflow';
import { Duration } from '@temporalio/common';
import type { createActivities } from './activities';

export const setValueSignal = defineSignal<[string, any]>('setValue');
export const acceptSignal = defineSignal('accept');
export const rejectSignal = defineSignal('reject');
export const getValueQuery = defineQuery<number | undefined, [string]>('getValue');

const { read, write } = proxyActivities<ReturnType<typeof createActivities>>({
  startToCloseTimeout: '6 minutes',
});

export interface IInput {
  akte?: IAkte;
  akten?: IAkte[];
  metadata?: any;
}

export interface IAkte {
  name: string;
  datum: string;
}

export function timeOutOrUserAction(timeout: Duration) {
  return new Promise((res) => {
    setHandler(acceptSignal, () => res('good'))
    setHandler(rejectSignal, () => res('bad'))
    sleep(timeout).then(() => res('no time'))
  })
}

export async function aktenFluss(input: IInput): Promise<void> {
  const state = new Map<string, any>();
  state.set('input', input);

  setHandler(setValueSignal, (key, value) => void state.set(key, value));
  setHandler(getValueQuery, (key) => state.get(key));

  // await read('something');

  const status = await timeOutOrUserAction('5 minutes');
  if (status === 'good') {
    await write('new-test');
  }
  else if (status === 'no time') {
    await write('you suck')
  }

  // await CancellationScope.current().cancelRequested;
}


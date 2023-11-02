import { CancellationScope, defineSignal, setHandler } from '@temporalio/workflow';
import { defineQuery } from '@temporalio/workflow';
import { proxyActivities } from '@temporalio/workflow';

export const setValueSignal = defineSignal<[string, any]>('setValue');
export const getValueQuery = defineQuery<number | undefined, [string]>('getValue');

export interface IInput {
  akte?: IAkte;
  akten?: IAkte[];
  metadata?: any;
}

export interface IAkte {
  name: string;
  datum: string;
}

export async function aktenFluss(input: IInput): Promise<void> {
  const state = new Map<string, any>();
  state.set('input', input);

  setHandler(setValueSignal, (key, value) => void state.set(key, value));
  setHandler(getValueQuery, (key) => state.get(key));

  await CancellationScope.current().cancelRequested;
}

import type { StoreApi, UseBoundStore } from "zustand";

type State = object;

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { select: { [K in keyof T]: () => T[K] } } : never;

/**
 * adds convenience usage
 *
 * ```js
 * const stuff = useStore.select.stuff()
 * ```
 *
 * instead of
 *
 * ```
 * const stuff = useStore(state => state.stuff)
 * ```
 */
export const createSelectors = <S extends UseBoundStore<StoreApi<State>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.select = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (store.select as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }
  return store;
};

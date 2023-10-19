import type { StoreApi, UseBoundStore } from "zustand";

type State = object;

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { select: { [K in keyof T]: () => T[K] } }
  : never;

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
export const createSelectors = <S extends UseBoundStore<StoreApi<State>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.select = {};
  for (let k of Object.keys(store.getState())) {
    (store.select as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }
  return store;
};

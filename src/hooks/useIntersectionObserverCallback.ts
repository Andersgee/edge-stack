import { type DependencyList, useEffect, useRef } from "react";

export function useIntersectionObserverCallback(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
  deps?: DependencyList
) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(callback, options);
    if (node !== null) {
      observer.observe(node);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  return ref;
}

import { useEffect, useRef } from "react";

export function useIntersectionObserverCallback(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[]
) {
  const ref = useRef<HTMLDivElement>(null);
  //const entry =
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

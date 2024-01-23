"use client";

import { PrettyDate } from "#src/components/PrettyDate";
import { type RouterOutputs, api } from "#src/hooks/api";

import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  x: RouterOutputs["post"]["infinitePosts"];
};

export function Wall({ x, className }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.post.infinitePosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: x.items.at(-1)?.id,
      initialData: { pages: [x], pageParams: [] },
    }
  );
  const ref = useIntersectionObserverCallback(
    ([entry]) => {
      const isVisible = !!entry?.isIntersecting;
      if (isVisible && !isFetchingNextPage && hasNextPage) {
        console.log("running fetchNextPage");
        void fetchNextPage();
      }
    },
    undefined,
    [isFetchingNextPage, hasNextPage]
  );

  return (
    <div className={cn("", className)}>
      {data?.pages
        .map((page) => page.items)
        .flat()
        .map((post) => (
          <div key={post.id}>
            <p>{post.text}</p>
            <div>
              <PrettyDate date={post.createdAt} />
            </div>
          </div>
        ))}

      <div>hasNextPage: {JSON.stringify(hasNextPage)}</div>
      <div>isFetchingNextPage: {JSON.stringify(isFetchingNextPage)}</div>
      <div>
        <button className="bg-red-500 p-3" onClick={() => fetchNextPage()}>
          fetchNextPage
        </button>
      </div>
      <div ref={ref}></div>
    </div>
  );
}

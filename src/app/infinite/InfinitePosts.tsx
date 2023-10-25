"use client";

import { PrettyDate } from "#src/components/PrettyDate";
import { type RouterOutputs, api } from "#src/hooks/api";
import { useIntersectionObserver } from "#src/hooks/useIntersectionObserver";
import { useMemo } from "react";

type Props = {
  initialData: RouterOutputs["post"]["initialInfinitePosts"];
  className?: string;
};

export function InfinitePosts({ initialData, className }: Props) {
  //const { posts, ref, isFetchingNextPage, hasNextPage } = useInfinitePosts();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.post.infinitePosts.useInfiniteQuery(
    {},
    {
      initialData: { pages: [initialData], pageParams: [] },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const ref = useIntersectionObserver<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage()
        .then(() => void {})
        .catch(() => void {});
    }
  });

  const posts = useMemo(() => data?.pages.map((page) => page.items).flat() ?? [], [data]);

  return (
    <div className={className}>
      <h2>InfinitePosts</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <div>id: {post.id}</div>
          <div className="gap flex">
            createdAt:
            <PrettyDate date={post.createdAt} />
          </div>
          <div>text: {post.text}</div>
        </div>
      ))}
      <div ref={ref}>{isFetchingNextPage ? "loading..." : "more"}</div>
    </div>
  );
}
/*
function useInfinitePosts() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.post.infinitePosts.useInfiniteQuery(
    {},
    {
      initialData: { pages: [{ items: [], nextCursor: 1 }], pageParams: [] },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const posts = useMemo(() => data?.pages.map((page) => page.items).flat() ?? [], [data]);

  const ref = useIntersectionObserver<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage()
        .then(() => void {})
        .catch(() => void {});
    }
  });

  return { posts, ref, isFetchingNextPage, hasNextPage };
}
*/

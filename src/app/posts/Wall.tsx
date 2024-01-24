"use client";

import { type RouterOutputs, api } from "#src/hooks/api";

import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { cn } from "#src/utils/cn";
import Link from "next/link";
import { Post } from "./Post";
import { hashidFromId } from "#src/utils/hashid";

type Props = {
  className?: string;
  initialPosts: RouterOutputs["post"]["infinitePosts"];
};

export function Wall({ initialPosts, className }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.post.infinitePosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: initialPosts.items.at(-1)?.id,
      initialData: { pages: [initialPosts], pageParams: [] },
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
          <Link
            key={post.id}
            prefetch={false}
            className="block hover:bg-color-neutral-200"
            href={`/posts/${hashidFromId(post.id)}`}
          >
            <Post post={post} />
          </Link>
        ))}
      <div ref={ref}></div>
    </div>
  );
}

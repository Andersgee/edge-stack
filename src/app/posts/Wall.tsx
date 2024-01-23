"use client";

import { PrettyDate } from "#src/components/PrettyDate";
import { type RouterOutputs, api } from "#src/hooks/api";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  x: RouterOutputs["post"]["infinitePosts"];
};

export function Wall({ x, className }: Props) {
  const utils = api.useUtils();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.post.infinitePosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: x.items.at(-1)?.id,
      initialData: { pages: [x], pageParams: [] },
    }
  );

  const hmm = () => {
    utils.post.infinitePosts.setInfiniteData({}, (data) => {
      if (!data) return data;
      const d = structuredClone(data);
      d.pages
        .at(0)
        ?.items.unshift({
          id: BigInt(999),
          createdAt: new Date(),
          text: "example",
          updatedAt: new Date(),
          userId: BigInt(1),
        });
      return d;
    });
  };

  return (
    <div className={cn("", className)}>
      <div>
        <button className="bg-red-300 p-3" onClick={() => hmm()}>
          add post at top
        </button>
      </div>

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
    </div>
  );
}

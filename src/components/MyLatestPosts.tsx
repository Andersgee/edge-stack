"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { useStore } from "#src/store";

import { cn } from "#src/utils/cn";
import { BorderWithLabel } from "./BorderWithLabel";
import { PrettyDate } from "./PrettyDate";

type Props = {
  className?: string;
  initialDataPostMylatest?: RouterOutputs["post"]["mylatest"];
};

export function MyLatestPosts({ className, initialDataPostMylatest }: Props) {
  const user = useStore.use.user();

  const { data: posts } = api.post.mylatest.useQuery(
    { n: 10 },
    {
      enabled: !!user,
      initialData: initialDataPostMylatest,
    }
  );

  return (
    <BorderWithLabel label="MyLatestPosts (client component)">
      <div className={cn("", className)}>
        <div>{`user: ${user?.name ?? "not signed in"}`}</div>
        <h3>my latests posts:</h3>
        <ul>
          {posts?.map((post) => (
            <li key={post.id} className="border-b py-2">
              <div>
                <PrettyDate date={post.createdAt} />
              </div>
              <div>{post.text}</div>
            </li>
          ))}
        </ul>
      </div>
    </BorderWithLabel>
  );
}

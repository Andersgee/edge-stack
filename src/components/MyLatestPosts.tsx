"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { useStore } from "#src/store";
import { cn } from "#src/utils/cn";
import { BorderWithLabel } from "./BorderWithLabel";
import { PostCrud } from "./PostCrud";
import { PrettyDate } from "./PrettyDate";
import { UserImage32x32 } from "./UserImage";

type Props = {
  className?: string;
  initialDataPostMylatest?: RouterOutputs["post"]["mylatest"];
};

export function MyLatestPosts({ className, initialDataPostMylatest }: Props) {
  const user = useStore.use.user();

  const { data: posts } = api.post.mylatest.useQuery(undefined, {
    enabled: !!user,
    initialData: initialDataPostMylatest,
  });

  return (
    <BorderWithLabel label="MyLatestPosts (client component)">
      <div className={cn("", className)}>
        <div>{`user: ${user?.name ?? "not signed in"}`}</div>
        <h3>my latests posts:</h3>
        <ul>
          {posts?.map((post) => (
            <li key={post.id} className="flex border-b py-2">
              <UserImage32x32 image={post.userImage ?? ""} alt={post.userName} />
              <div>
                <div>
                  <PrettyDate date={post.createdAt} />
                </div>
                <div>{post.text}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <BorderWithLabel label="PostCrud (client component)">
        <PostCrud />
      </BorderWithLabel>
    </BorderWithLabel>
  );
}

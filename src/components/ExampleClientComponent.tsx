"use client";

import { api } from "#src/hooks/api";
import { useStore } from "#src/store";
import { cn } from "#src/utils/cn";
import { BorderWithLabel } from "./BorderWithLabel";
import { PrettyDate } from "./PrettyDate";

type Props = {
  className?: string;
  slow: boolean;
};

export function ExampleClientComponent({ className, slow }: Props) {
  const user = useStore.use.user();

  const { data: posts } = api.post.latest.useQuery({ slow: slow });
  return (
    <BorderWithLabel label="ExampleClientComponent">
      <div className={cn("", className)}>
        <div>{user ? `user: signed in as ${user.name}` : "user: not signed in"}</div>
        <h3>posts:</h3>
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

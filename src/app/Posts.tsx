"use client";

import { CreatePostForm } from "#src/components/CreatePostForm";
import { PostCRUD } from "#src/components/PostCRUD";
import { api, type RouterOutputs } from "#src/hooks/api";
import type { TokenUser } from "#src/utils/jwt/schema";

type Props = {
  className?: string;
  user: TokenUser;
  initialData: RouterOutputs["post"]["latest10whereImEditor"];
};

export function Posts({ user, className, initialData }: Props) {
  const apiUtils = api.useUtils();
  const { data: posts } = api.post.latest10whereImEditor.useQuery(undefined, { initialData: initialData });

  return (
    <main className="flex justify-center">
      <div className="">
        <CreatePostForm
          onSuccess={(newPost) => {
            apiUtils.post.latest10whereImEditor.setData(undefined, (prev) => {
              if (!prev) return prev;
              const data = structuredClone(prev);
              data.unshift(newPost);
              return data;
            });
          }}
        />
        <div className="">{posts.map((post) => (post ? <PostCRUD key={post.id} initialPost={post} /> : null))}</div>
      </div>
    </main>
  );
}

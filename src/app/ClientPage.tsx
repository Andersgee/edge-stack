"use client";

import { CreatePostForm } from "#src/components/CreatePostForm";
import { CrudPostExample } from "#src/components/CrudPostExample";
import { api, type RouterOutputs } from "#src/hooks/api";
import type { TokenUser } from "#src/utils/jwt/schema";

type Props = {
  className?: string;
  user: TokenUser;
  initialData: RouterOutputs["post"]["myLatest10"];
};

export function ClientPage({ user, className, initialData }: Props) {
  const apiUtils = api.useUtils();
  const { data: myLatest10 } = api.post.myLatest10.useQuery(undefined, { initialData: initialData });

  return (
    <main className="flex justify-center">
      <div className="">
        <CreatePostForm
          onSuccess={(newPost) => {
            apiUtils.post.myLatest10.setData(undefined, (prev) => {
              if (!prev) return prev;
              const data = structuredClone(prev);
              data.unshift(newPost);
              return data;
            });
          }}
        />
        <div className="">
          {myLatest10.map((post) => (
            <div key={post.id} className="my-4">
              <CrudPostExample initialPost={post} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

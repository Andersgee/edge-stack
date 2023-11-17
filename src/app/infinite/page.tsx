import { BorderWithLabel } from "#src/components/BorderWithLabel";
import { LoadMorePosts, PostCreate, PostList } from "#src/components/InfinitePosts";
import { apiRsc } from "#src/trpc/api-rsc";
import { Suspense } from "react";

//export const runtime = "edge";

export default function Page() {
  return (
    <BorderWithLabel label="/infinite/page.tsx">
      <Suspense fallback={<p>Loading...</p>}>
        <Wrapper />
      </Suspense>
    </BorderWithLabel>
  );
}

async function Wrapper() {
  const { api, user } = await apiRsc();

  const initialData = await api.post.infinitePosts({});
  return (
    <>
      {/*<LoadMorePosts />*/}
      <PostCreate user={user} />
      <PostList initialData={initialData} user={user} />
    </>
  );
}

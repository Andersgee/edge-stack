import { apiRsc } from "#src/trpc/api-rsc";
import { LoadMorePosts, PostCreate, PostList } from "#src/components/Post";

export default async function Page() {
  const { api, user } = await apiRsc();
  const initialData = await api.post.infinitePosts.fetch({});

  return (
    <div className="mb-8 flex justify-center px-4">
      <main>
        <h1>Optimistic infinite CRUD</h1>
        <p className="text-sm">Create, read, update and delete posts without loading states.</p>
        <p className="my-1 text-sm italic">
          note: To show error handlng and rollback; any create / update / delete actions will error after 2 seconds 50%
          of the time.
        </p>
        <PostCreate user={user} />
        <LoadMorePosts />
        <PostList initialData={initialData} user={user} />
      </main>
    </div>
  );
}

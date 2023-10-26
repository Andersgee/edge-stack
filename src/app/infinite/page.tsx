import { apiRsc } from "#src/trpc/api-rsc";
import { PostCreate, PostList } from "./Post";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const { api, user } = await apiRsc();
  const initialData = await api.post.infinitePosts.fetch({});
  return (
    <div className="flex justify-center px-4">
      <main className="">
        <h1>Optimistic infinite CRUD</h1>
        <p>Create, read, update and delete posts without loading states.</p>
        <p className="my-1 text-sm font-medium italic">
          note: To show error handlng and rollback. Any create / update / delete actions have a 50% change to error afer
          2 seconds.
        </p>
        <PostCreate user={user} />
        <PostList initialData={initialData} user={user} />
      </main>
    </div>
  );
}

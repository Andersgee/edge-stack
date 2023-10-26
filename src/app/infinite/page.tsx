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
      <div className="">
        <h1>Optimistic infinite CRUD</h1>
        <p>Create, read, update and delete posts without loading states.</p>
        <p className="my-1 text-sm font-semibold italic">
          note: To show error handlng rollback the Create button will error afer 2 seconds 25% of the time.
        </p>
        <PostCreate user={user} />
        <PostList initialData={initialData} user={user} />
      </div>
    </div>
  );
}

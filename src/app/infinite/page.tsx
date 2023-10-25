import { apiRscPublic } from "#src/trpc/api-rsc";
import { InfinitePosts } from "./InfinitePosts";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const initialData = await apiRscPublic.post.initialInfinitePosts.fetch();
  return (
    <div>
      <div>page</div>
      <InfinitePosts initialData={initialData} />
    </div>
  );
}

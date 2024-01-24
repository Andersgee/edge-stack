import { apiRscPublic } from "#src/trpc/api-rsc";
import { idFromHashid } from "#src/utils/hashid";
import { notFound } from "next/navigation";
import { Post } from "../Post";
import Link from "next/link";

type Props = {
  params: { hashid: string };
};

export default async function Page({ params: { hashid } }: Props) {
  const { api } = apiRscPublic();
  const id = idFromHashid(hashid);
  if (!id) notFound();

  const post = await api.post.getById({ id });
  if (!post) notFound();
  return (
    <div>
      <h1>fully server rendered page with individual post</h1>
      <p>cached with tag server side</p>
      <Link href="/posts">back</Link>
      <Post post={post} />
    </div>
  );
}

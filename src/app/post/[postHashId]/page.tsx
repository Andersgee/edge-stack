import { PostCRUD, PostInfo } from "#src/components/PostCRUD";
import { apiRsc } from "#src/trpc/api-rsc";
import { idFromHashid } from "#src/utils/hashid";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  //searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { postHashId: string };
};

export default async function Page({ params }: Props) {
  const { api, user } = await apiRsc();
  const postId = idFromHashid(params.postHashId);
  if (!postId) notFound();
  const postInfo = await api.post.getById.fetch({ postId });
  if (!postInfo) notFound();

  const isEditor = user && postInfo.editors.map((editor) => editor.userId).includes(user.id);

  return (
    <div>
      <p>below here you can edit the post if you are one of its editors, otherwise just view it</p>
      {isEditor ? <PostCRUD initialPost={postInfo} /> : <PostInfo initialPost={postInfo} />}
    </div>
  );
}

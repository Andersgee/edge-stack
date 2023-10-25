import { PostCRUD, PostInfo } from "#src/components/Post";
import { apiRsc } from "#src/trpc/api-rsc";
import { idFromHashid } from "#src/utils/hashid";
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
    <main className="flex justify-center">
      <div className="">
        <p>if you are one of the editors of this post, then you can edit it</p>
        {isEditor ? <PostCRUD initialPost={postInfo} /> : <PostInfo post={postInfo} />}
      </div>
    </main>
  );
}

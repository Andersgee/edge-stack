import { apiRscPublic } from "#src/trpc/api-rsc";
import { CreatePost } from "./CreatePost";
import { Wall } from "./Wall";

export default async function Page() {
  const { api } = apiRscPublic();
  const initialPosts = await api.post.latest();
  return (
    <div>
      <h1>your basic post crud example</h1>
      <CreatePost />
      <Wall initialData={initialPosts} />
    </div>
  );
}

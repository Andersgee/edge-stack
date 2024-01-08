import { apiRscPublic } from "#src/trpc/api-rsc";
import { CreatePost } from "./CreatePost";

export default async function Page() {
  const { api } = apiRscPublic();
  const posts = await api.post.latest();
  return (
    <div>
      <h1>your basic post crud example</h1>
      <CreatePost />
      {posts.map((post) => (
        <div key={post.id}>{post.text}</div>
      ))}
    </div>
  );
}

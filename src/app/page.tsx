import { apiRsc } from "#src/trpc/api-rsc";
import { Posts } from "./Posts";

export default async function Page() {
  const { api, user } = await apiRsc();

  const myLatest10 = user ? await api.post.latest10whereImEditor.fetch() : [];

  if (!user) {
    return <div>you dont have any posts (not signed in)</div>;
  }
  return <Posts user={user} initialData={myLatest10} />;
}

import { SigninButtons } from "#src/components/SigninButtons";
import { apiRsc } from "#src/trpc/api-rsc";
import { Posts } from "./Posts";

export default async function Page() {
  const { api, user } = await apiRsc();

  const myLatest10 = user ? await api.post.latest10whereImEditor.fetch() : [];

  if (!user) {
    return (
      <main className="flex justify-center">
        <div className="">
          <h1>Welcome</h1>
          <SigninButtons />
        </div>
      </main>
    );
  }

  return <Posts user={user} initialData={myLatest10} />;
}

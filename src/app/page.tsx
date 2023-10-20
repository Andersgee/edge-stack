import { SigninButtons } from "#src/components/SigninButtons";
import { apiRsc } from "#src/trpc/api-rsc";
import { ClientPage } from "./ClientPage";

export default async function Page() {
  const { api, user } = await apiRsc();

  //const latest10 = await api.post.latest10.fetch();
  const myLatest10 = user ? await api.post.myLatest10.fetch() : [];
  return user ? (
    <ClientPage user={user} initialData={myLatest10} />
  ) : (
    <main>
      <SigninButtons />
    </main>
  );
}

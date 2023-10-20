import { CreatePostForm, DeletePostButton, UpdatePostForm } from "#src/components/CreatePostForm";
import { SigninButtons } from "#src/components/SigninButtons";
import { apiRsc } from "#src/trpc/api-rsc";

export default async function Page() {
  const { api, user } = await apiRsc();

  const latest10 = await api.post.latest10.fetch();
  const myLatest10 = user ? await api.post.myLatest10.fetch() : [];
  return (
    <main className="">
      <div className="bg-slate-500 p-2">
        <h2>this is a server component</h2>
        <div className="flex justify-between">
          <div>
            latest 10 from Everyone
            {latest10.map((post) => (
              <div key={post.id} className="flex">
                <p>{post.text}</p>
                <DeletePostButton postId={post.id} />
                <UpdatePostForm postId={post.id} />
              </div>
            ))}
          </div>
          <div>
            latest 10 from Me:
            {user ? (
              <div>
                <p>signed in as {user.name}. </p>
                <p>your latest 10 posts:</p>
                {myLatest10.map((post) => (
                  <div key={post.id}>{post.text}</div>
                ))}
              </div>
            ) : (
              <div>
                <SigninButtons />
              </div>
            )}
          </div>
        </div>
      </div>
      <CreatePostForm />
    </main>
  );
}

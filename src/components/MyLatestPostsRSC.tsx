import { apiRsc } from "#src/trpc/api-rsc";
//import { apiRsc } from "#src/trpc/api-rsc";
import { cn } from "#src/utils/cn";
import { BorderWithLabel } from "./BorderWithLabel";
import { PrettyDate } from "./PrettyDate";

type Props = {
  className?: string;
};

export async function MyLatestPostsRSC({ className }: Props) {
  const { api, user } = await apiRsc();

  const posts = user ? await api.post.mylatest.fetch({ n: 10 }) : undefined;
  return (
    <BorderWithLabel label="MyLatestPostsRSC (server component)">
      <div className={cn("", className)}>
        <div>{user ? `user: signed in as ${user.name}` : "user: not signed in"}</div>
        <h3>my latests posts:</h3>
        <ul>
          {posts?.map((post) => (
            <li key={post.id} className="border-b py-2">
              <div>
                <PrettyDate date={post.createdAt} />
              </div>
              <div>{post.text}</div>
            </li>
          ))}
        </ul>
      </div>
    </BorderWithLabel>
  );
}

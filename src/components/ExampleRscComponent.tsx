import { apiRsc } from "#src/trpc/api-rsc";
import { cn } from "#src/utils/cn";
import { BorderWithLabel } from "./BorderWithLabel";
import { PrettyDate } from "./PrettyDate";

type Props = {
  className?: string;
  slow: boolean;
};

export async function ExampleRscComponent({ className, slow }: Props) {
  const { api, user } = await apiRsc();

  const posts = await api.post.latest.fetch({ slow: slow });
  return (
    <BorderWithLabel label="ExampleRscComponent">
      <div className={cn("", className)}>
        <div>{user ? `user: signed in as ${user.name}` : "user: not signed in"}</div>
        <h3>posts:</h3>
        <ul>
          {posts.map((post) => (
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

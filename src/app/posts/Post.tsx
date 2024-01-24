import { PrettyDate } from "#src/components/PrettyDate";
import { type RouterOutputs } from "#src/hooks/api";
import { cn } from "#src/utils/cn";

type Props = {
  post: NonNullable<RouterOutputs["post"]["getById"]>;
  className?: string;
};

export function Post({ className, post }: Props) {
  return (
    <div className={cn("", className)}>
      <p>{post.text}</p>
      <div>
        <PrettyDate date={post.createdAt} />
      </div>
    </div>
  );
}

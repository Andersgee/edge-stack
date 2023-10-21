"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";
import { useState } from "react";
import { Username } from "./Username";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { IconExternalLink } from "./Icons";

type Props = {
  className?: string;
  initialPost: NonNullable<RouterOutputs["post"]["getById"]>;
};

export function PostCRUD({ initialPost, className }: Props) {
  const postId = initialPost.id;
  const [isEditing, setIsEditing] = useState(false);

  const apiUtils = api.useUtils();
  const { data: postInfo } = api.post.getById.useQuery(
    { postId },
    {
      initialData: initialPost,
    }
  );
  const postUpdate = api.post.update.useMutation({
    onSuccess: (updatedPost) => {
      setIsEditing(false);
      apiUtils.post.getById.setData({ postId }, updatedPost);
    },
  });

  const postDelete = api.post.delete.useMutation({
    onSuccess: () => {
      apiUtils.post.getById.setData({ postId }, null);
    },
  });
  const [text, setText] = useState("");

  if (!postInfo) return null;

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="icon" size="icon">
        <Link href={`/post/${hashidFromId(postInfo.id)}`} prefetch={false}>
          <IconExternalLink clickable />
        </Link>
      </Button>
      <Button variant="destructive" disabled={postDelete.isLoading} onClick={() => postDelete.mutate({ postId })}>
        Delete
      </Button>

      {isEditing ? (
        <div className="flex">
          <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button variant="default" disabled={postUpdate.isLoading} onClick={() => postUpdate.mutate({ postId, text })}>
            Save
          </Button>
        </div>
      ) : (
        <div>
          <Button
            variant="outline"
            onClick={() => {
              setText(postInfo.text ?? "");
              setIsEditing(true);
            }}
          >
            Edit
          </Button>
        </div>
      )}

      {isEditing ? (
        <Input type="text" onChange={(e) => setText(e.target.value)} value={text} />
      ) : (
        <div>
          {postInfo.editors.map((editor) => (
            <Username key={editor.userId} userId={editor.userId} />
          ))}

          <p>{postInfo.text}</p>
        </div>
      )}
    </div>
  );
}

export function PostInfo({ initialPost, className }: Props) {
  const postId = initialPost.id;

  const { data: postInfo } = api.post.getById.useQuery(
    { postId },
    {
      initialData: initialPost,
    }
  );

  if (!postInfo) return null;

  return (
    <div>
      {postInfo.editors.map((editor) => (
        <Username key={editor.userId} userId={editor.userId} />
      ))}

      <p>{postInfo.createdAt.toLocaleString()}</p>
      <p>{postInfo.text}</p>
    </div>
  );
}

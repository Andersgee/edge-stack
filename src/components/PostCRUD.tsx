"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";
import { useState } from "react";
import { Username } from "./Username";

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
    <div className="flex gap-2">
      <Link className="px-3 py-2" href={`/post/${hashidFromId(postInfo.id)}`} prefetch={false}>
        Go to post
      </Link>
      <button
        className="bg-red-500 px-3 py-2"
        disabled={postDelete.isLoading}
        onClick={() => postDelete.mutate({ postId })}
      >
        Delete
      </button>

      {isEditing ? (
        <div className="flex">
          <button className="bg-yellow-500 px-3 py-2" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
          <button
            className="bg-green-500 px-3 py-2"
            disabled={postUpdate.isLoading}
            onClick={() => postUpdate.mutate({ postId, text })}
          >
            Save
          </button>
        </div>
      ) : (
        <div>
          <button
            className="bg-yellow-500 px-3 py-2"
            onClick={() => {
              setText(postInfo.text ?? "");
              setIsEditing(true);
            }}
          >
            Edit
          </button>
        </div>
      )}

      {isEditing ? (
        <input className="text-black" type="text" onChange={(e) => setText(e.target.value)} value={text} />
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

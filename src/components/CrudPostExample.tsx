"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { useState } from "react";

type Props = {
  className?: string;
  initialPost: NonNullable<RouterOutputs["post"]["info"]>;
};

export function CrudPostExample({ initialPost, className }: Props) {
  const postId = initialPost.id;
  const [isEditing, setIsEditing] = useState(false);

  const apiUtils = api.useUtils();
  const { data: postInfo } = api.post.info.useQuery(
    { postId },
    {
      initialData: initialPost,
    }
  );
  const postUpdate = api.post.update.useMutation({
    onSuccess: (updatedPost) => {
      setIsEditing(false);
      apiUtils.post.info.setData({ postId }, updatedPost);
    },
  });

  const postDelete = api.post.delete.useMutation({
    onSuccess: () => {
      apiUtils.post.info.setData({ postId }, null);
    },
  });
  const [text, setText] = useState("");

  if (!postInfo) return null;

  return (
    <div className="flex gap-2">
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
        <p className={className}>{postInfo.text}</p>
      )}
    </div>
  );
}

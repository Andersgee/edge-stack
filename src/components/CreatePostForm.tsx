"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { useState } from "react";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  onSuccess: (newPost: RouterOutputs["post"]["create"]) => void;
};

export function CreatePostForm({ onSuccess }: Props) {
  const [text, setText] = useState("");

  const postCreate = api.post.create.useMutation({
    onSuccess: (newPost) => onSuccess(newPost),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        postCreate.mutate({ text });
        setText("");
      }}
      className="my-10"
    >
      <input
        type="text"
        placeholder="some text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 text-black"
      />
      <button type="submit" className="ml-4 bg-green-500 px-3 py-2" disabled={postCreate.isLoading}>
        {postCreate.isLoading ? "Loading..." : "Create"}
      </button>
    </form>
  );
}

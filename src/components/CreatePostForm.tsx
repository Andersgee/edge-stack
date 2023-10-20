"use client";

import { api } from "#src/hooks/api";
import { useState } from "react";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
};

export function CreatePostForm({ className }: Props) {
  const [text, setText] = useState("");

  const postCreate = api.post.create.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        postCreate.mutate({ text });
        setText("");
      }}
      className={cn("flex flex-col gap-2", className)}
    >
      <input
        type="text"
        placeholder="some text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={postCreate.isLoading}
      >
        {postCreate.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export function DeletePostButton({ postId }: { postId: number }) {
  const postRemove = api.post.delete.useMutation();

  return (
    <button onClick={() => postRemove.mutate({ postId })} className="bg-red-500 p-2">
      DELETE
    </button>
  );
}

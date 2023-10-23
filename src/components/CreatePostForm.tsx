"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
      className="my-10 flex items-center"
    >
      <Input type="text" placeholder="some text" value={text} onChange={(e) => setText(e.target.value)} />
      <Button variant="primary" type="submit" className="ml-4" disabled={postCreate.isLoading || !text}>
        {postCreate.isLoading ? "Loading..." : "Create"}
      </Button>
    </form>
  );
}

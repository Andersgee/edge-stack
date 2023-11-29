"use client";

import { Button } from "#src/components/ui/button";
import { Input } from "#src/components/ui/input";
import { api } from "#src/hooks/api";
import { cn } from "#src/utils/cn";
import { useState } from "react";
import { Trash } from "./Icons";

type Props = {
  className?: string;
};

export function PostCrud({ className }: Props) {
  const [text, setText] = useState("");
  //const apiUtils = api.useUtils();
  const postCreate = api.post.create.useMutation({
    onSuccess: (_createdPost) => {
      setText("");
      //if (createdPost) {
      //  apiUtils.post.mylatest.setData(undefined, (prev) => {
      //    if (!prev) return prev;
      //    const data = structuredClone(prev);
      //    return [createdPost, ...data];
      //  });
      //}
    },
  });

  return (
    <div className={cn("flex", className)}>
      <Input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={() => postCreate.mutate({ text })} disabled={postCreate.isPending || !text}>
        create
      </Button>
    </div>
  );
}

export function DeletePostButton({ postId }: { postId: number }) {
  const { mutate } = api.post.delete.useMutation();

  return (
    <Button variant="icon" className="" onClick={() => mutate({ postId })}>
      <Trash className="p-2.5 text-color-accent-danger-400" />
    </Button>
  );
}

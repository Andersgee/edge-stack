"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { useStore } from "#src/store";
import { cn } from "#src/utils/cn";
import { useState } from "react";
import { BorderWithLabel } from "./BorderWithLabel";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  className?: string;
  initialData?: RouterOutputs["post"]["mylatest"];
};

export function ExamplesList({ className, initialData }: Props) {
  const user = useStore.use.user();

  const { data: posts } = api.example.getAll.useQuery(undefined, {
    //enabled: !!user,
    initialData: initialData,
  });

  return (
    <BorderWithLabel label="ExamplesList (client component)">
      <div className={cn("", className)}>
        <div>{`user: ${user?.name ?? "not signed in"}`}</div>
        <h3>alla examples:</h3>
        <ul>
          {posts?.map((post) => (
            <li key={post.id} className="flex gap-4 border-b py-4">
              <div>
                <div>{post.text}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <CreateExample />
    </BorderWithLabel>
  );
}

export function CreateExample({ className }: Props) {
  const [text, setText] = useState("");

  const apiUtils = api.useUtils();
  const { mutate, isLoading } = api.example.create.useMutation({
    onSuccess: ({ insertId }) => {
      setText("");
      void apiUtils.example.getAll.invalidate();
    },
  });

  return (
    <div className={cn("flex", className)}>
      <Input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={() => mutate({ text })} disabled={isLoading || !text}>
        create
      </Button>
    </div>
  );
}

"use client";

import { type RouterOutputs, api } from "#src/hooks/api";

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Check, Edit, MoreHorizontal, Trash, X } from "./Icons";
import { PrettyDate } from "./PrettyDate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useStore } from "#src/store";
import { cn } from "#src/utils/cn";
import { randomUint } from "#src/utils/random";

export function Posts({
  className,
  initialData,
}: {
  className?: string;
  initialData: RouterOutputs["post"]["latest10whereImEditor"];
}) {
  const { data: posts } = api.post.latest10whereImEditor.useQuery(undefined, { initialData: initialData });

  return (
    <main className={cn("flex justify-center", className)}>
      <div className="">
        <CreatePostForm />
        <div className="">{posts.map((post) => (post ? <PostCRUD key={post.id} initialPost={post} /> : null))}</div>
      </div>
    </main>
  );
}

export function PostCRUD({ initialPost }: { initialPost: NonNullable<RouterOutputs["post"]["getById"]> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const postId = initialPost.id;

  const apiUtils = api.useUtils();
  const { data: postInfo } = api.post.getById.useQuery(
    { postId },
    {
      initialData: initialPost,
    }
  );

  const postUpdate = api.post.update.useMutation({
    onMutate: ({ text, postId }) => {
      const context = { postInfoBeforeOptimisticUpdate: apiUtils.post.getById.getData({ postId }) };

      apiUtils.post.getById.setData({ postId }, (prev) => {
        if (!prev) return prev;
        const data = structuredClone(prev);
        return { ...data, text };
      });
      setIsEditing(false);

      return context;
    },
    onError: (_err, _variables, context) => {
      //rollback to using the context returned whatever we returned in onMutate as context
      apiUtils.post.getById.setData({ postId }, context?.postInfoBeforeOptimisticUpdate);
    },
  });

  const postDelete = api.post.delete.useMutation({
    onMutate: ({ postId }) => {
      const context = { postInfoBeforeOptimisticDelete: apiUtils.post.getById.getData({ postId }) };

      apiUtils.post.getById.setData({ postId }, null);

      return context;
    },
    onError: (_err, _variables, context) => {
      //rollback
      apiUtils.post.getById.setData({ postId }, context?.postInfoBeforeOptimisticDelete);
    },
  });

  const [text, setText] = useState("");

  if (!postInfo) return null;

  const isOptimistic = postInfo.id < 0;

  return (
    <div className={cn("flex gap-4", isOptimistic && "duration-300 animate-in slide-in-from-top")}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={isOptimistic}>
          <Button variant="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className=""
          onCloseAutoFocus={(e) => {
            if (isEditing) {
              e.preventDefault();
              inputRef.current?.focus();
            }
          }}
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={(e) => {
                setText(postInfo.text ?? "");
                setIsEditing(true);
                //e.preventDefault();
                //setOpen(false);
              }}
              className="py-3"
            >
              <Edit /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={postDelete.isLoading}
              onSelect={(e) => {
                //e.preventDefault(); //prevent autofocus on DropdownMenuTrigger, aka allow autofocus on <Input>
                postDelete.mutate({ postId });
              }}
              className="py-3"
            >
              <Trash /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditing ? (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            postUpdate.mutate({ postId, text });
          }}
        >
          <Input ref={inputRef} autoFocus type="text" onChange={(e) => setText(e.target.value)} value={text} />
          <Button
            type="submit"
            variant="positive"
            disabled={postUpdate.isLoading}
            //onClick={() => postUpdate.mutate({ postId, text })}
          >
            <Check /> Save
          </Button>
          <Button variant="icon" onClick={() => setIsEditing(false)}>
            <X /> Cancel
          </Button>
        </form>
      ) : (
        <PostInfo post={postInfo} />
      )}
    </div>
  );
}

export function PostInfo({ post }: { post: NonNullable<RouterOutputs["post"]["getById"]> }) {
  return (
    <div>
      <div className="flex gap-2">
        {/*<div>{`postId: ${post.id}`}</div>*/}
        {post.editors.map((editor) => (
          <div key={editor.userId}>{editor.name}</div>
        ))}
        <div className="">
          <PrettyDate date={post.createdAt} />
        </div>
      </div>
      <p>{post.text}</p>
    </div>
  );
}

export function CreatePostForm() {
  const user = useStore.use.user();
  const [text, setText] = useState("");

  const apiUtils = api.useUtils();

  const postCreate = api.post.create.useMutation({
    onMutate: (variables) => {
      //add an optimisticPost at beginning of latest10whereImEditor
      const optimisticPost = {
        createdAt: new Date(),
        text: variables.text,
        editors: user ? [{ userId: user.id, image: user.image, name: user.name }] : [],
        id: -randomUint(), //some (negative) random id until we get the real id
      };

      apiUtils.post.latest10whereImEditor.setData(undefined, (prev) => {
        if (!prev) return prev;
        const data = structuredClone(prev);
        data.unshift(optimisticPost);
        return data;
      });

      const context = { optimisticPost };
      return context;
    },
    onError(_error, _variables, context) {
      //rollback, remove optimisticPost
      if (!context?.optimisticPost) return;
      apiUtils.post.latest10whereImEditor.setData(undefined, (prev) => {
        if (!prev) return prev;
        const data = structuredClone(prev);
        const newData = data.filter((post) => post?.id !== context.optimisticPost.id);
        return newData;
      });
    },
    onSuccess(createdPost, _variables, context) {
      //replace optimisticPost with actual createdPost
      if (!createdPost || !context?.optimisticPost) return;

      apiUtils.post.latest10whereImEditor.setData(undefined, (prev) => {
        if (!prev) return prev;
        const data = structuredClone(prev);

        const optimisticPost = data.find((post) => post?.id === context.optimisticPost.id);
        if (optimisticPost) {
          Object.assign(optimisticPost, createdPost);
        }
        return data;
      });
    },
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
      <Button variant="primary" type="submit" className="ml-4" disabled={!text}>
        Create
      </Button>
    </form>
  );
}

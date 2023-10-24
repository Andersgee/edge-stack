"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Check, Edit, ExternalLink, MoreHorizontal, Trash, X } from "./Icons";
import { PrettyDate } from "./PrettyDate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Props = {
  className?: string;
  initialPost: NonNullable<RouterOutputs["post"]["getById"]>;
};

export function PostCRUD2({ initialPost, className }: Props) {
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
    //onSuccess: (updatedPost) => {
    //  apiUtils.post.getById.setData({ postId }, updatedPost);
    //},
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
    //onSuccess: () => {
    //  apiUtils.post.getById.setData({ postId }, null);
    //},
    onError: (_err, _variables, context) => {
      //rollback to using the context returned whatever we returned in onMutate as context
      apiUtils.post.getById.setData({ postId }, context?.postInfoBeforeOptimisticDelete);
    },
  });

  const [text, setText] = useState("");

  if (!postInfo) return null;

  return (
    <div className="flex gap-4">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => {
                setText(postInfo.text ?? "");
                setIsEditing(true);
              }}
              className="py-3"
            >
              <Edit /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={postDelete.isLoading}
              onSelect={() => postDelete.mutate({ postId })}
              className="py-3"
            >
              <Trash /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditing ? (
        <div className="flex gap-2">
          <Input autoFocus type="text" onChange={(e) => setText(e.target.value)} value={text} />
          <Button variant="icon" onClick={() => setIsEditing(false)}>
            <X /> Cancel
          </Button>
          <Button
            variant="positive"
            disabled={postUpdate.isLoading}
            onClick={() => postUpdate.mutate({ postId, text })}
          >
            <Check /> Save
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            {postInfo.editors.map((editor) => (
              <div key={editor.userId}>{editor.name}</div>
            ))}
            <div className="">
              <PrettyDate date={postInfo.createdAt} />
            </div>
          </div>
          <p>{postInfo.text}</p>
        </div>
      )}
    </div>
  );
}

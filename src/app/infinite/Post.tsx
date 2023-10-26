"use client";

import { IconLoadingSpinner } from "#src/components/IconsSpecial";
import { PrettyDate } from "#src/components/PrettyDate";
import { Input } from "#src/components/ui/input";
import { type RouterOutputs, api } from "#src/hooks/api";
import { type TokenUser } from "#src/utils/jwt/schema";
import { useEffect, useRef, useState } from "react";
import { Button } from "#src/components/ui/button";
import { randomUint } from "#src/utils/random";
import { cn } from "#src/utils/cn";
import { useStore } from "#src/store";
import { UserImage32x32ById } from "#src/components/UserImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "#src/components/ui/dropdown-menu";
import { Check, Edit, MoreHorizontal, Trash, X } from "#src/components/Icons";
import { useIntersectionObserver } from "#src/hooks/useIntersectionObserver";

export function PostList({
  initialData,
  user,
}: {
  initialData: RouterOutputs["post"]["infinitePosts"];
  user: TokenUser | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, {});
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.post.infinitePosts.useInfiniteQuery(
    {},
    {
      initialData: { pages: [initialData], pageParams: [] },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage) {
      fetchNextPage()
        .then(() => void {})
        .catch(() => void {});
    }
  }, [entry, hasNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages
        .map((page) => page.items)
        .flat()
        .map((post) => {
          const isCreator = post.userId === user?.id;
          const isOptimistic = post.id < 0;
          return !!user && isCreator && !isOptimistic ? (
            <PostListItemForCreator key={post.id} post={post} user={user} />
          ) : (
            <PostListItem key={post.id} post={post} />
          );
        })}
      <div className="flex h-8 items-center justify-center" ref={ref}>
        {hasNextPage ? (
          isFetchingNextPage ? (
            <>
              <IconLoadingSpinner className="mr-2 h-8 w-8" /> loading more...
            </>
          ) : (
            ""
          )
        ) : (
          "nothing more to see"
        )}
      </div>
    </div>
  );
}

function PostListItem({ post }: { post: RouterOutputs["post"]["infinitePosts"]["items"][number] }) {
  const isOptimistic = post.id < 0;
  return (
    <div className={cn("my-4 flex gap-2", isOptimistic && "duration-75 animate-in slide-in-from-top")}>
      <div className="h-11 w-11"></div>
      <UserImage32x32ById userId={post.userId} />
      <div>
        <div className="text-sm text-color-neutral-700">
          <PrettyDate date={post.createdAt} />
        </div>
        <p className="text-color-neutral-900">{post.text}</p>
      </div>
    </div>
  );
}

function PostListItemForCreator({
  post,
  user,
}: {
  post: RouterOutputs["post"]["infinitePosts"]["items"][number];
  user: TokenUser;
}) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");

  const apiUtils = api.useUtils();

  const postDelete = api.post.delete.useMutation({
    onMutate: (variables) => {
      //find and remove post from infinitePosts

      const context: { deletedPost: RouterOutputs["post"]["infinitePosts"]["items"][number] | undefined } = {
        deletedPost: undefined,
      };

      apiUtils.post.infinitePosts.setInfiniteData({}, (prev) => {
        if (!prev) return prev;
        const data = structuredClone(prev); //dont mutate prev

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        outer: for (let i = 0; i < data.pages.length; i++) {
          for (let j = 0; j < data.pages[i]!.items.length; j++) {
            const item = data.pages[i]!.items[j]!;
            if (item.id === variables.postId) {
              context.deletedPost = data.pages[i]!.items.splice(j, 1)[0];
              break outer;
            }
          }
        }
        return data;
      });

      return context;
    },
    onError: (_err, _variables, context) => {
      //rollback, insert post again at proper place
      const deletedPost = context?.deletedPost;
      if (!deletedPost) return;

      apiUtils.post.infinitePosts.setInfiniteData({}, (prev) => {
        if (!prev) return prev;
        const data = structuredClone(prev); //dont mutate prev

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        outer: for (let i = 0; i < data.pages.length; i++) {
          for (let j = 0; j < data.pages[i]!.items.length; j++) {
            const item = data.pages[i]!.items[j]!;
            if (item.id < deletedPost.id) {
              data.pages[i]!.items.splice(j, 0, deletedPost);
              break outer;
            }
          }
        }

        return data;
      });
    },
  });

  const postUpdate = api.post.update.useMutation({
    onMutate: (variables) => {
      const context: { postBeforeUpdate: RouterOutputs["post"]["infinitePosts"]["items"][number] | undefined } = {
        postBeforeUpdate: undefined,
      };

      apiUtils.post.infinitePosts.setInfiniteData({}, (prev) => {
        if (!prev) return prev;
        const data = structuredClone(prev); //dont mutate prev

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        outer: for (let i = 0; i < data.pages.length; i++) {
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let j = 0; j < data.pages[i]!.items.length; j++) {
            const item = data.pages[i]!.items[j]!;
            if (item.id === variables.postId) {
              context.postBeforeUpdate = structuredClone(item);
              item.text = variables.text;
              //item.lastEditedAt = new Date()
              break outer;
            }
          }
        }
        return data;
      });

      return context;
    },
    onError: (_err, _variables, context) => {
      //rollback, insert post again at proper place
      const postBeforeUpdate = context?.postBeforeUpdate;
      if (!postBeforeUpdate) return;

      apiUtils.post.infinitePosts.setInfiniteData({}, (prev) => {
        if (!prev) return prev;
        const data = structuredClone(prev); //dont mutate prev

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        outer: for (let i = 0; i < data.pages.length; i++) {
          for (let j = 0; j < data.pages[i]!.items.length; j++) {
            const item = data.pages[i]!.items[j]!;
            if (item.id === postBeforeUpdate.id) {
              data.pages[i]!.items.splice(j, 1, postBeforeUpdate);
              break outer;
            }
          }
        }

        return data;
      });
    },
  });

  return (
    <div className="my-4 flex gap-2">
      <div className="h-11 w-11">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
                  setText(post.text);
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
                  postDelete.mutate({ postId: post.id });
                }}
                className="py-3"
              >
                <Trash /> Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <UserImage32x32ById userId={post.userId} />
      <div>
        <div className="text-sm text-color-neutral-700">
          <PrettyDate date={post.createdAt} />
        </div>
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              postUpdate.mutate({ postId: post.id, text });
              setIsEditing(false);
            }}
          >
            <Input ref={inputRef} autoFocus type="text" onChange={(e) => setText(e.target.value)} value={text} />
            <div className="flex gap-2">
              <Button type="submit" variant="positive" disabled={postUpdate.isLoading}>
                <Check /> Save
              </Button>
              <Button type="button" variant="icon" onClick={() => setIsEditing(false)}>
                <X /> Cancel
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-color-neutral-900">{post.text}</p>
        )}
      </div>
    </div>
  );
}

export function PostCreate({ user }: { user: TokenUser | null }) {
  const dialogAction = useStore.use.dialogAction();
  const [text, setText] = useState("");

  const apiUtils = api.useUtils();

  const postCreate = api.post.create.useMutation({
    onMutate: (variables) => {
      //add an optimisticPost at beginning of infinitePosts
      const optimisticPost = {
        id: -randomUint(), //some (negative) random id until we get the real id
        text: variables.text,
        createdAt: new Date(),
        userId: user?.id ?? -randomUint(), //doesnt really matter
      };
      apiUtils.post.infinitePosts.setInfiniteData({}, (prev) => {
        if (!prev) return prev;
        const data = structuredClone(prev); //dont mutate prev
        data?.pages[0]?.items.unshift(optimisticPost);
        return data;
      });

      const context = { optimisticPost };
      return context;
    },
    onError(_error, _variables, context) {
      //rollback, remove optimisticPost
      if (!context?.optimisticPost) return;

      apiUtils.post.infinitePosts.setInfiniteData({}, (prev) => {
        if (!prev) return prev;
        const data = structuredClone(prev); //dont mutate prev
        if (data.pages[0]?.items) {
          data.pages[0].items = data.pages[0].items.filter((post) => post.id !== context.optimisticPost.id);
        }
        return data;
      });
    },
    onSuccess(createdPost, _variables, context) {
      //replace optimisticPost with actual createdPost
      if (!createdPost || !context?.optimisticPost) return;

      apiUtils.post.infinitePosts.setInfiniteData({}, (prev) => {
        if (!prev) return prev;
        const data = structuredClone(prev);
        if (data.pages[0]?.items) {
          const index = data.pages[0].items.findIndex((post) => post.id === context.optimisticPost.id);
          if (index !== -1) data.pages[0].items[index] = createdPost;
        }
        return data;
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!user) {
          dialogAction({ type: "show", name: "profilebutton" });
        } else {
          postCreate.mutate({ text });
          setText("");
        }
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

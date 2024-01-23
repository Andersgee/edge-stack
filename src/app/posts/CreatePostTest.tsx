"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "#src/hooks/api";
import { Button } from "#src/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "#src/ui/form";
import { Input } from "#src/ui/input";
import { useToast } from "#src/ui/use-toast";
import { useStore } from "#src/store";
import { dialogDispatch } from "#src/store/slices/dialog";

const zFormData = z.object({
  text: z.string().min(1, { message: "at least 1 character" }),
});

type FormData = z.infer<typeof zFormData>;

export function CreatePostTest() {
  const form = useForm<FormData>({
    resolver: zodResolver(zFormData),
    defaultValues: {
      text: "",
    },
  });
  const { toast } = useToast();
  const utils = api.useUtils();

  const postCreate = api.post.create.useMutation({
    onSuccess: (createdPost) => {
      utils.post.infinitePosts.setInfiniteData({}, (data) => {
        if (!data) return data;
        const d = structuredClone(data);
        d.pages.at(0)?.items.unshift(createdPost);
        return d;
      });
      form.reset();
      //void actionRevalidateTag(tagsPost.info(createdPost.id))
    },
    onError: (_error, _variables, _context) => {
      toast({ variant: "warn", title: "Couldnt create post", description: "Try again" });
    },
  });
  const user = useStore.use.user();

  function onValid(data: FormData) {
    if (user) {
      postCreate.mutate(data);
    } else {
      dialogDispatch({ type: "show", name: "profilebutton" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>some label</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Whats happening?" {...field} />
              </FormControl>
              <FormDescription>some description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={postCreate.isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

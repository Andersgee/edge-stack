"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "#src/hooks/api";
import { Button } from "#src/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "#src/ui/form";
import { Input } from "#src/ui/input";

const FormSchema = z.object({
  text: z.string().min(1, {
    message: "text must be at least 1 character.",
  }),
});

export function CreatePost() {
  const postCreate = api.post.create.useMutation({
    onSuccess: (insertResult) => {
      console.log("submitted, insertResult:", insertResult);
    },
    onError: () => {
      console.log("error");
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("submitted, data:", data);
    //postCreate.mutate({text})
    //toast({
    //  title: "You submitted the following values:",
    //  description: (
    //    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //      <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //    </pre>
    //  ),
    //})
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => postCreate.mutate(data))} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>some text</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Whats happening?" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

/*
import { api } from "#src/hooks/api";
import { Button } from "#src/ui/button";
import { Input } from "#src/ui/input";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
};

export function CreatePost({ className }: Props) {
  const postCreate = api.post.create.useMutation();
  return (
    <div className={cn("", className)}>
      <Input type="text" />
      <Button>Create</Button>
    </div>
  );
}
*/

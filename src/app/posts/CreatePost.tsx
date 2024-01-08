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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => postCreate.mutate(data))} className="w-2/3 space-y-6">
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

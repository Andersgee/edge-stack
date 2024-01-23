"use server";

import { getUserFromCookie } from "#src/utils/jwt";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function actionRevalidateTag(tag: string) {
  const user = await getUserFromCookie();
  if (user) {
    revalidateTag(tag);
  }
}

export async function actionRevalidateTagAndRedirect(tag: string, path: string) {
  const user = await getUserFromCookie();
  if (user) {
    revalidateTag(tag);
    redirect(path);
  }
}

export async function actionRevalidateTags(tags: string[]) {
  const user = await getUserFromCookie();
  if (user) {
    for (const tag of tags) {
      revalidateTag(tag);
    }
  }
}

export async function actionRevalidateTagsAndRedirect(tags: string[], path: string) {
  const user = await getUserFromCookie();
  if (user) {
    for (const tag of tags) {
      revalidateTag(tag);
    }
    redirect(path);
  }
}

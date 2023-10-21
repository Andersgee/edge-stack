"use client";

import { api } from "#src/hooks/api";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  userId: number;
};

export function Username({ className, userId }: Props) {
  const { data: user } = api.user.infoPublic.useQuery({ userId });
  return <div className={cn("mr-2", className)}>{user?.name ?? "-"}</div>;
}

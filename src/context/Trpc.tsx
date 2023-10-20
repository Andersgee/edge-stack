"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { transformer } from "#src/trpc/transformer";
import { api } from "#src/hooks/api";
import { baseUrl } from "#src/utils/url";

//https://tanstack.com/query/v4/docs/react/guides/important-defaults

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            refetchInterval: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            refetchIntervalInBackground: false,
            retry: false,
            //(default cacheTime is 5 min, meaning would refetch any "not on screen" (aka inactive) queries if looking at some other page for 5 min
            //cacheTime: 1000 * 60 * 60,
            cacheTime: Infinity,
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: transformer,
      links: [
        httpBatchLink({
          url: baseUrl("/api/trpc"),
        }),
      ],
    })
  );
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}

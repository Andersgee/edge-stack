import { BorderWithLabel } from "#src/components/BorderWithLabel";
import { MyLatestPosts } from "#src/components/MyLatestPosts";
import { apiRsc } from "#src/trpc/api-rsc";
import { Suspense } from "react";

//export const runtime = "edge";

export default function Page() {
  return (
    <BorderWithLabel label="/client-suspense-data/page.tsx">
      <Suspense fallback={<p>Loading MyLatestPosts...</p>}>
        <SuspendedMyLatestPosts />
      </Suspense>
    </BorderWithLabel>
  );
}

async function SuspendedMyLatestPosts() {
  const { api, user } = await apiRsc();

  const initialData = user ? await api.post.mylatest.fetch() : undefined;
  return <MyLatestPosts initialDataPostMylatest={initialData} />;
}

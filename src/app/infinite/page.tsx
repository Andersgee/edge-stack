import { BorderWithLabel } from "#src/components/BorderWithLabel";
import { apiRsc } from "#src/trpc/api-rsc";
import { Suspense } from "react";

//export const runtime = "edge";

export default function Page() {
  return (
    <BorderWithLabel label="/client-suspense-data/page.tsx">
      <Suspense fallback={<p>Loading...</p>}>
        <Wrapper />
      </Suspense>
    </BorderWithLabel>
  );
}

async function Wrapper() {
  const { api, user } = await apiRsc();

  const initialData = user ? await api.post.infinitePosts.fetch({}) : undefined;
  return <div>a</div>;
}

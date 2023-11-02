import { BorderWithLabel } from "#src/components/BorderWithLabel";
import { ExampleClientComponentWithInitial } from "#src/components/ExampleClientComponentWithInitial";
import { apiRscPublic } from "#src/trpc/api-rsc";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <BorderWithLabel label="/best-of-both/page">
      <p>Notice that this entire box didnt have to wait for data.</p>
      <p>
        This is a <code>λ (Dynamic)</code> page via <code>{`dynamic = "force-dynamic"`}</code> so this will be in
        in-memory client-side cache (aka Router Cache) for <code>30 seconds</code>.
      </p>
      <p>After that it will be considered stale (forever apparently, and always request new data)</p>

      <p>
        Below is a slow clientcomponent that fetches data, but with react-query (client side cache in javascript) so we
        can invalidated it at any time we feel like.
      </p>
      <p>The data below here is *NOT* waterfall though, eg there is no extra fetch after page load.</p>

      <Suspense fallback={<p>Loading ExampleClientComponentWithInitial...</p>}>
        <Wrapper />
      </Suspense>
    </BorderWithLabel>
  );
}

async function Wrapper() {
  const initialData = await apiRscPublic.post.latest.fetch({ slow: true });
  return <ExampleClientComponentWithInitial slow={true} initialData={initialData} />;
}

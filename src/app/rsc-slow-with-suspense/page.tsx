import { BorderWithLabel } from "#src/components/BorderWithLabel";
import { ExampleRscComponent } from "#src/components/ExampleRscComponent";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <BorderWithLabel label="/rsc-slow-with-suspense/page">
      <p>Notice that this entire box didnt have to wait for data.</p>
      <p>
        This is a <code>λ (Dynamic)</code> page via <code>{`dynamic = "force-dynamic"`}</code> so this will be in
        in-memory client-side cache (aka Router Cache) for <code>30 seconds</code>.
      </p>
      <p>After that it will be considered stale (forever apparently, and always request new data)</p>
      <p>Below is a slow servercomponent that fetches data</p>
      <Suspense fallback={<p>Loading ExampleRscComponent...</p>}>
        <ExampleRscComponent slow={true} />
      </Suspense>
    </BorderWithLabel>
  );
}

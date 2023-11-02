//import { apiRsc } from "#src/trpc/api-rsc";

import { BorderWithLabel } from "#src/components/BorderWithLabel";

export default function Page() {
  return (
    <BorderWithLabel label="/page">
      <p>
        This page is a <code>○ (Static)</code> page so this will be in in-memory client-side cache (aka Router Cache)
        for <code>5 minutes</code>.
      </p>
      <p>After that it will be considered stale and fetch new data</p>
    </BorderWithLabel>
  );
}

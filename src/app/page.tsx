//import { apiRsc } from "#src/trpc/api-rsc";

import { BorderWithLabel } from "#src/components/BorderWithLabel";

export default function Page() {
  return (
    <BorderWithLabel label="/page">
      <p>
        just reading Github discussion <a href="https://github.com/vercel/next.js/discussions/54075">Deep Dive</a> and
        trying develop some intuition about it.
      </p>
      <p>
        This page is a <code>○ (Static)</code> page so this will be in in-memory client-side cache (aka Router Cache)
        for <code>300 seconds (5 minutes)</code>.
      </p>
      <p>After that it will be considered stale and request fresh data.</p>
      <p>However page will be in the Data Cache on server so it just responds with 304 instead of data.</p>
    </BorderWithLabel>
  );
}

import { BorderWithLabel } from "#src/components/BorderWithLabel";
import { ExampleClientComponent } from "#src/components/ExampleClientComponent";

export default function Page() {
  return (
    <BorderWithLabel label="/slow/page">
      <p>
        This page is a <code>○ (Static)</code> page so this will be in in-memory client-side cache (aka Router Cache)
        for <code>300 seconds (5 minutes)</code>.
      </p>
      <p>After that it will be considered stale and request fresh data.</p>
      <p>However page will be in the Data Cache on server so it just responds with 304 instead of data.</p>
      <p>
        Below is a slow clientcomponent that fetches data, but with react-query (client side cache in javascript) so we
        can invalidated it at any time we feel like.
      </p>
      <p>
        The data below here is waterfall though, eg will start fetching only after basically entire page and js bundles
        are fetched and run.
      </p>
      <ExampleClientComponent slow={true} />
    </BorderWithLabel>
  );
}

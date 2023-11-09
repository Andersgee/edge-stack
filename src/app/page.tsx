//import { apiRsc } from "#src/trpc/api-rsc";

import { BorderWithLabel } from "#src/components/BorderWithLabel";

export default function Page() {
  return (
    <BorderWithLabel label="/page">
      <p>
        important note: use <code>{`<Link prefetch={true}>`}</code> or <code>{`<Link prefetch={false}>`}</code> leaving
        it undefined has borked interaction with Router Cache in next 14.0.1.
      </p>
      <p>
        if using prefetch true, then page will be in in-memory client-side cache (aka Router Cache) for{" "}
        <code>300 seconds (5 minutes)</code>. Yes even dynamic pages.
      </p>
      <p>
        If using prefetch false then only <code>30 seconds</code>, but will also not prefetch obviously.
      </p>
      <p>
        For simplicity only use dynamic pages, eg root layout is dynamic with proper auth state of user on page load.
        Static vs dynamic page doesnt really matter since we can use server-side http-cache aka (aka Data Cache) to have
        data available and respond instantly anyway.
      </p>

      <p>
        more about Router Cache: <a href="https://nextjs.org/docs/app/building-your-application/caching">here</a> and{" "}
        <a href="https://github.com/vercel/next.js/discussions/54075">deep dive</a>
      </p>
    </BorderWithLabel>
  );
}

import { BorderWithLabel } from "#src/components/BorderWithLabel";
import { MyLatestPostsRSC } from "#src/components/MyLatestPostsRSC";
import { Suspense } from "react";

export default function Page() {
  return (
    <BorderWithLabel label="/rsc-data-suspense/page.tsx">
      <Suspense fallback={<p>Loading MyLatestPostsRSC...</p>}>
        <MyLatestPostsRSC />
      </Suspense>
    </BorderWithLabel>
  );
}

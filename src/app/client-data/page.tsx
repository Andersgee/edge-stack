import { BorderWithLabel } from "#src/components/BorderWithLabel";
import { MyLatestPosts } from "#src/components/MyLatestPosts";

export default function Page() {
  return (
    <BorderWithLabel label="/client-data/page.tsx">
      <MyLatestPosts />
    </BorderWithLabel>
  );
}

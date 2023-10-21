import { apiRsc } from "#src/trpc/api-rsc";
import Link from "next/link";
import { SigninButtons } from "./SigninButtons";
import { SignoutButton } from "./SignoutButton";

export default async function Topnav() {
  const { user } = await apiRsc();
  return user ? (
    <div className="flex justify-between">
      <HomeButton />
      <div className="flex items-center">
        <div className="mr-2">signed in as {user.name}</div>
        <SignoutButton className="bg-purple-500 px-3 py-2">sign out</SignoutButton>
      </div>
    </div>
  ) : (
    <div className="flex justify-between">
      <div>
        <HomeButton />
      </div>
      <div className="flex items-center">
        <SigninButtons />
      </div>
    </div>
  );
}

function HomeButton() {
  return (
    <Link href="/" className="bg-blue-400 px-3 py-2">
      Home
    </Link>
  );
}

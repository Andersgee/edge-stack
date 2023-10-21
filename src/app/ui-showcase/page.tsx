import { Button } from "#src/components/ui/button";
import { CardDemo } from "./CardDemo";
import { ComboboxDemo } from "./ComboBoxDemo";
import { ComboboxDropdownMenu } from "./ComboboxDropdownMenu";

export default function Page() {
  return (
    <main className="flex justify-center">
      <div className="container flex flex-wrap">
        <h1>UI showcase</h1>
        <div>
          <h2>1. CardDemo</h2>
          <CardDemo />
        </div>
        <div>
          <h2>2. ComboboxDemo</h2>
          <ComboboxDemo />
        </div>
        <div>
          <h2>3. ComboboxDropdownMenu</h2>
          <ComboboxDropdownMenu />
        </div>

        <div>
          <h2>4. Some buttons</h2>
          <div className="flex flex-col gap-2">
            <div>
              <Button variant="default">default</Button>
            </div>
            <div>
              <Button variant="destructive">destructive</Button>
            </div>
            <div>
              <Button variant="ghost">ghost</Button>
            </div>
            <div>
              <Button variant="icon">icon</Button>
            </div>
            <div>
              <Button variant="link">link</Button>
            </div>
            <div>
              <Button variant="outline">outline</Button>
            </div>
            <div>
              <Button variant="secondary">secondary</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

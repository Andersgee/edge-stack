import { ButtonsDemo } from "./ButtonsDemo";
import { CardDemo } from "./CardDemo";
import { ComboboxDemo } from "./ComboBoxDemo";
import { ComboboxDropdownMenu } from "./ComboboxDropdownMenu";

export default function Page() {
  return (
    <main className="flex justify-center">
      <div className="container flex flex-wrap justify-center gap-12">
        <div>
          <h2>1. CardDemo</h2>
          <CardDemo />
        </div>
        <div>
          <div>
            <h2>2. ComboboxDemo</h2>
            <ComboboxDemo />
          </div>
          <div>
            <h2>3. ComboboxDropdownMenu</h2>
            <ComboboxDropdownMenu />
          </div>
        </div>

        <div>
          <h2>4. ButtonsDemo</h2>
          <ButtonsDemo />
        </div>
      </div>
    </main>
  );
}

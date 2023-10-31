import { ButtonsDemo } from "./ButtonsDemo";
import { CardDemo } from "./CardDemo";
import { ComboboxDemo } from "./ComboBoxDemo";
import { ComboboxDropdownMenu } from "./ComboboxDropdownMenu";
import { DialogDemo } from "./DialogDemo";
import { InputDemo } from "./InputDemo";

export default function Page() {
  return (
    <main className="flex justify-center">
      <div className="container flex flex-wrap justify-center gap-12">
        <div className="">
          <h2 className="mx-auto">1. CardDemo</h2>
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
        <div>
          <h2>5. DialogDemo</h2>
          <DialogDemo />
          <h2>6. InputDemo</h2>
          <InputDemo />
        </div>
      </div>
    </main>
  );
}

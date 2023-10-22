import { Check, Edit, Trash } from "#src/components/Icons";
import { Button } from "#src/components/ui/button";

export function ButtonsDemo() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Button variant="primary">Primary</Button>
      </div>
      <div>
        <Button variant="warning">Warning</Button>
      </div>
      <div>
        <Button variant="danger">
          <Trash /> Danger
        </Button>
      </div>
      <div>
        <Button variant="positive">
          <Check /> Positive
        </Button>
      </div>
      <div>
        <Button variant="icon">
          <Edit /> Icon
        </Button>
      </div>
      <div>
        <Button variant="link">Link</Button>
      </div>
    </div>
  );
}

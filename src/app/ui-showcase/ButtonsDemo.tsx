import { Button } from "#src/components/ui/button";

export function ButtonsDemo() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Button variant="primary">primary</Button>
      </div>
      <div>
        <Button variant="warning">warning</Button>
      </div>
      <div>
        <Button variant="danger">danger</Button>
      </div>
      <div>
        <Button variant="positive">positive</Button>
      </div>
      <div>
        <Button variant="icon">icon</Button>
      </div>
      <div>
        <Button variant="link">link</Button>
      </div>
    </div>
  );
}

import { Button } from "#src/components/ui/button";

export function ButtonsDemo() {
  return (
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
  );
}

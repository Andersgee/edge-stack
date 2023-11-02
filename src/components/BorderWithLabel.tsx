type Props = {
  children: React.ReactNode;
  label: string;
};

export function BorderWithLabel({ children, label }: Props) {
  return (
    <fieldset role="presentation" className="w-full border-4 p-4">
      <legend role="presentation">{label}</legend>
      {children}
    </fieldset>
  );

  //return <div className="border-2 p-2">{children}</div>;
}

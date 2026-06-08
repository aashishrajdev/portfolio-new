/* Shared section heading — fixed top position so About / Works /
   Projects / Contact titles all land in the same place. */
export default function PageHeading({ title }: { title: string }) {
  return (
    <header className="shrink-0 px-4 pt-24 text-center md:pt-28">
      <h1 className="font-serif fluid-fs-title tracking-tight leading-none text-foreground">
        {title}
      </h1>
    </header>
  );
}

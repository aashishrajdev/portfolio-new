import PageHeading from "./PageHeading";

/* Viewport shell — the single place that decides how a section "fits the
   display": one screen on desktop (no scroll), scrollable on phones, with
   a consistent heading slot. Every section renders inside this. */
export default function Screen({
  heading,
  children,
  contentClassName = "",
}: {
  heading?: string;
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden md:h-dvh">
      {heading ? <PageHeading title={heading} /> : null}
      <div
        className={`relative z-10 flex min-h-0 flex-1 flex-col ${contentClassName}`}
      >
        {children}
      </div>
    </section>
  );
}

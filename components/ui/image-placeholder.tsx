import { FiImage } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  /** Tailwind aspect-ratio utility. Defaults to "aspect-video". */
  aspect?: string;
  /** Optional faint label rendered under the icon. */
  label?: string;
  className?: string;
}

/**
 * Monochrome placeholder surface used where an image/screenshot will go.
 * No external assets — just a bordered box with a faint icon + label.
 */
export function ImagePlaceholder({
  aspect = "aspect-video",
  label,
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface",
        aspect,
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
        <FiImage className="h-6 w-6" aria-hidden />
        {label ? (
          <span className="text-xs font-medium uppercase tracking-wider">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md";

interface BaseProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  href?: undefined;
}

type ButtonProps = ButtonAsLink | ButtonAsButton;

/* The 3D read comes from a hard (un-blurred) offset shadow acting as the
   button's extruded edge: it grows as the button lifts on hover and collapses
   as the button travels down on press. */
const variants: Record<Variant, string> = {
  primary: cn(
    "bg-foreground text-background border border-foreground hover:bg-foreground/90",
    "shadow-[0_4px_0_0_var(--muted-foreground)]",
    "hover:shadow-[0_6px_0_0_var(--muted-foreground)]",
    "active:shadow-[0_1px_0_0_var(--muted-foreground)]",
  ),
  outline: cn(
    "border border-border text-foreground hover:bg-surface",
    "shadow-[0_4px_0_0_var(--border)]",
    "hover:shadow-[0_6px_0_0_var(--border)]",
    "active:shadow-[0_1px_0_0_var(--border)]",
  ),
  ghost: cn(
    "border border-transparent text-foreground hover:bg-surface",
    "shadow-[0_4px_0_0_var(--border)]",
    "hover:shadow-[0_6px_0_0_var(--border)]",
    "active:shadow-[0_1px_0_0_var(--border)]",
  ),
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
};

/**
 * Monochrome action. Renders an <a> when `href` is provided, otherwise a
 * <button>. rounded-full, hairline borders, hover surface fill, and a hard
 * offset edge that lifts on hover and presses down on click. Focus ring is
 * provided globally via :focus-visible.
 */
export function Button(props: ButtonProps) {
  const { children, className, variant = "primary", size = "md" } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium",
    "transition-[transform,box-shadow,background-color,border-color] duration-150 ease-out",
    "hover:-translate-y-0.5 active:translate-y-0.5",
    "motion-reduce:transform-none motion-reduce:transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    "disabled:translate-y-0 disabled:shadow-none",
    variants[variant],
    sizes[size],
    className
  );

  if (props.href !== undefined) {
    const { href, target, rel } = props;
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
      </a>
    );
  }

  // Strip the shared/link-only props so only valid button attributes remain.
  const {
    href: _href,
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    ...rest
  } = props;
  void _href;
  void _variant;
  void _size;
  void _className;
  void _children;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

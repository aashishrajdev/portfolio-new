import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "signal";
type Size = "xs" | "sm" | "md" | "icon" | "icon-sm";

interface BaseProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
}

interface ButtonAsLink
  extends BaseProps,
    Omit<ComponentPropsWithRef<"a">, keyof BaseProps> {
  href: string;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<ComponentPropsWithRef<"button">, keyof BaseProps> {
  href?: undefined;
}

type ButtonProps = ButtonAsLink | ButtonAsButton;

/* Every variant is the same glass; they differ only in how thick the fill is
   mixed and what rims it. The layered bevel, specular highlight and shadows
   live in `.glass-btn` in globals.css, since the stack is five box-shadows
   deep and cannot be expressed as utilities. */
const variants: Record<Variant, string> = {
  primary: "glass-btn glass-btn-strong text-foreground",
  outline: "glass-btn text-foreground",
  ghost: "glass-btn text-foreground",
  signal: "glass-btn glass-btn-signal text-foreground",
};

const sizes: Record<Size, string> = {
  xs: "h-8 px-3 text-xs",
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  /** Square, for a lone icon. */
  icon: "h-9 w-9 p-0",
  "icon-sm": "h-8 w-8 p-0",
};

/**
 * The single action surface for the site. Renders an <a> when `href` is
 * provided, otherwise a <button>; both forward their native attributes, so a
 * link keeps `aria-label`/`target` and a button keeps `type`/`disabled`.
 *
 * rounded-full glass: a translucent fill over a blurred backdrop, a lit top
 * bevel, a shaded base and soft shadows underneath. Lifts on hover, sinks on
 * press, and drops the travel under `prefers-reduced-motion`. Focus ring comes
 * from the global :focus-visible rule.
 *
 * Pass `className` to override shape where a control needs it — e.g.
 * `rounded-md` for the square footer icons.
 */
export function Button(props: ButtonProps) {
  const { children, className, variant = "primary", size = "md" } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium",
    "transition-[transform,box-shadow,border-color,color] duration-150 ease-out",
    "hover:-translate-y-0.5 active:translate-y-px",
    "motion-reduce:transform-none motion-reduce:transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    "disabled:translate-y-0 disabled:shadow-none",
    variants[variant],
    sizes[size],
    className,
  );

  if (props.href !== undefined) {
    // Strip the shared props so only valid anchor attributes remain.
    const {
      variant: _variant,
      size: _size,
      className: _className,
      children: _children,
      ...rest
    } = props;
    void _variant;
    void _size;
    void _className;
    void _children;

    return (
      <a className={classes} {...rest}>
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

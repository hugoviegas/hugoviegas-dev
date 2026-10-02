import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

/* eslint-disable react-refresh/only-export-components */
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-btn",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        // Site CTA: solid green with two studs on its top edge. Studs lift on
        // hover; the button drops onto its base when pressed.
        primary:
          "relative bg-primary text-primary-foreground font-semibold shadow-btn transition-[background-color,transform,box-shadow] duration-fast ease-out hover:bg-primary-hover active:translate-y-[3px] active:bg-primary-pressed active:shadow-none before:absolute before:-top-1 before:left-3.5 before:h-1 before:w-2.5 before:rounded-t-[2px] before:bg-inherit before:transition-transform before:duration-fast before:ease-snap after:absolute after:-top-1 after:left-7 after:h-1 after:w-2.5 after:rounded-t-[2px] after:bg-inherit after:transition-transform after:duration-fast after:ease-snap hover:before:-translate-y-px hover:after:-translate-y-px disabled:bg-surface-2 disabled:text-ink-3 disabled:shadow-none disabled:opacity-100",
        // Neutral outline used beside the primary CTA.
        neutral:
          "border border-line-strong bg-card text-foreground font-semibold shadow-btn-neutral transition-[background-color,transform,box-shadow] duration-fast ease-out hover:bg-surface-2 active:translate-y-[3px] active:bg-surface-3 active:shadow-none disabled:border-border disabled:text-ink-3 disabled:shadow-none disabled:opacity-100",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        // 44px touch target for compact site actions (card buttons).
        touch: "h-11 px-4",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

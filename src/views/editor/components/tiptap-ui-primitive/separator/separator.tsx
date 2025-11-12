import type { JSX } from "preact"
import "./separator.scss"
import { cn } from "../../../lib/tiptap-utils"
import { forwardRef } from "preact/compat";

export type Orientation = "horizontal" | "vertical"

export interface SeparatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation
  decorative?: boolean
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ decorative, orientation = "vertical", className, ...divProps }, ref) => {
    const ariaOrientation = orientation === "vertical" ? orientation : undefined
    const semanticProps = decorative
      ? { role: "none" }
      : { "aria-orientation": ariaOrientation, role: "separator" }

    return (
      <div
        className={cn("tiptap-separator", className)}
        data-orientation={orientation}
        {...semanticProps}
        {...divProps}
        ref={ref}
      />
    )
  }
)

Separator.displayName = "Separator"

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Bento - invisible bento-grid primitives (BLOG-FLOW bento placement).
 *
 * <Bento preset="folio|cinema|ledger|zine"> lays a 12-column grid.
 * <BentoCell span="1-8"> opts a single cell into an explicit span;
 * without a span, the preset assigns alternating defaults:
 *
 *   folio   first cell spans the full measure, rest flow single
 *   cinema  cells alternate 1-12 / 1-8 (full-width feature, then lead-in)
 *   ledger  cells alternate 1-7 / 8-12 (wide entry, narrow receipt)
 *   zine    cells alternate 1-7 / 4-10, odd rows nudged down one step
 *           (stagger applies at desktop widths only)
 *
 * Containers are invisible by default: no borders, no backgrounds.
 * Cells must be direct children for nth-of-type presets to count.
 * The matching CSS (.bento, .bento-cell) lives in app/globals.css
 * under the utilities layer so MDX can also use the raw classes.
 */
export type BentoPreset = "folio" | "cinema" | "ledger" | "zine";

export type BentoSpan =
  | "1-12"
  | "1-8"
  | "9-12"
  | "1-6"
  | "7-12"
  | "1-7"
  | "4-10";

export function Bento({
  preset,
  className,
  children,
}: {
  preset?: BentoPreset;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      data-bento-preset={preset}
      className={cn("bento", preset && `bento-${preset}`, className)}
    >
      {children}
    </section>
  );
}

export function BentoCell({
  span,
  className,
  children,
}: {
  span?: BentoSpan;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-span={span} className={cn("bento-cell", className)}>
      {children}
    </div>
  );
}

/* GENERATED FILE. DO NOT EDIT, AND DO NOT DRAW THIS MARK ANYWHERE ELSE.
 *
 * Written by compound-ops/brand/app-icons/sync.mjs out of
 * compound-ops/brand/app-icons/icons/leakless-site.svg, which is the estate's ONE source for this
 * app's mark. The browser tab, this app's own header and the product tile on the studio site
 * are the same drawing because all three are fed from that file. To change the mark, change it
 * there and run:
 *
 *   node ~/CompoundLabs/compound-ops/brand/app-icons/sync.mjs
 *
 * compound-ops/tools/gates/one-logo-per-app.mjs fails the nightly sweep when this file stops
 * matching the registry, or when a component starts drawing the mark by hand again.
 */
export const MARK_SLUG = "leakless-site";
export const MARK_VIEWBOX = "0 0 64 64";
export const MARK_WIDTH = 64;
export const MARK_HEIGHT = 64;
/** The root <svg>'s own fill, where the registry file sets one. */
export const MARK_ROOT_FILL: string | null = null;
/** The ink the glyph is painted in, this product's accent. null when it draws in currentColor. */
export const MARK_INK: string | null = "#C8B14F";
/** Everything inside the registry file's own <svg>. */
export const MARK_INNER = "<rect width=\"64\" height=\"64\" rx=\"12\" fill=\"#0b0c0d\"/><path d=\"M32 9 52 16v15c0 13-8 20-20 25C20 51 12 44 12 31V16l20-7Z\" fill=\"#C8B14F\"/><path d=\"M32 21c4 6 8 10.5 8 15a8 8 0 1 1-16 0c0-4.5 4-9 8-15Z\" fill=\"#0b0c0d\"/><rect x=\"26\" y=\"25\" width=\"12\" height=\"4\" fill=\"#C8B14F\"/>";
/** The plate the family paints behind the glyph, where this mark has one. */
export const MARK_PLATE: string | null = "<rect width=\"64\" height=\"64\" rx=\"12\" fill=\"#0b0c0d\"/>";
/** The glyph without that plate, for a header that paints its own ground. */
export const MARK_GLYPH = "<path d=\"M32 9 52 16v15c0 13-8 20-20 25C20 51 12 44 12 31V16l20-7Z\" fill=\"#C8B14F\"/><path d=\"M32 21c4 6 8 10.5 8 15a8 8 0 1 1-16 0c0-4.5 4-9 8-15Z\" fill=\"#0b0c0d\"/><rect x=\"26\" y=\"25\" width=\"12\" height=\"4\" fill=\"#C8B14F\"/>";
/** The registry file entire, for a header that injects the whole mark. */
export const MARK_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><rect width=\"64\" height=\"64\" rx=\"12\" fill=\"#0b0c0d\"/><path d=\"M32 9 52 16v15c0 13-8 20-20 25C20 51 12 44 12 31V16l20-7Z\" fill=\"#C8B14F\"/><path d=\"M32 21c4 6 8 10.5 8 15a8 8 0 1 1-16 0c0-4.5 4-9 8-15Z\" fill=\"#0b0c0d\"/><rect x=\"26\" y=\"25\" width=\"12\" height=\"4\" fill=\"#C8B14F\"/></svg>";

/** The same markup with the ink swapped, for a header that recolours the mark. */
export function markInner(color?: string): string {
  return color && MARK_INK ? MARK_INNER.split(MARK_INK).join(color) : MARK_INNER;
}

/** The glyph alone, ink swapped the same way. */
export function markGlyph(color?: string): string {
  return color && MARK_INK ? MARK_GLYPH.split(MARK_INK).join(color) : MARK_GLYPH;
}

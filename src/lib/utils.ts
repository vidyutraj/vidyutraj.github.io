import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Our type scale uses named sizes (`text-body`, `text-caption`, …) rather than
 * Tailwind's defaults. tailwind-merge can't tell those from text *colours*, so
 * without this it drops `text-background` when a size class follows it — which
 * silently paints white labels on white buttons. Teach it the scale instead.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-xl",
            "display",
            "display-sm",
            "title",
            "title-sm",
            "body-lg",
            "body",
            "body-sm",
            "caption",
            "eyebrow",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get asset path with base URL for GitHub Pages compatibility
 * @param path - Asset path (e.g., '/logos/image.png')
 * @returns Path with base URL prepended
 */
export function getAssetPath(path: string): string {
  // Remove leading slash if present, then add base URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

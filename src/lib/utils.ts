import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

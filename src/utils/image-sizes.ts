/*
utility for fixed (but maybe different) image sizes at different tailwind breakpoints
make sure these values match what is in next.config.mjs and tailwind.config.ts
eg 
deviceSizes and imageSizes in next.config.mjs
and screens in tailwind.config.ts
*/

const DEVICE_SIZES = {
  "sm": 640,
  "md": 768,
  "lg": 1024,
  "xl": 1280,
  "2xl": 1536,
} as const;

const IMAGE_SIZES = {
  "w-6": 24,
  "w-8": 32,
  "w-12": 48,
  "w-16": 64,
  "w-24": 96,
  "w-32": 128,
  "w-64": 256,
  "w-96": 384,
} as const;

type TailwindSize = keyof typeof IMAGE_SIZES;

type Options = {
  "sm"?: TailwindSize;
  "md"?: TailwindSize;
  "lg"?: TailwindSize;
  "xl"?: TailwindSize;
  "2xl"?: TailwindSize;
};

//the browser goes over the list of sources and picks the first one that matches
//so order matters, meaning default value is last (without media query condition)

/**
 * helper for `<Image sizes="..."/>` media query prop with matching tailwind sizes
 * ### example usage
 * ```jsx
 * <div className="relative h-64 w-64 sm:h-96 sm:w-96">
 *     <Image src={src} alt={alt} sizes={imageSizes("w-64", { sm: "w-96" })} fill className="object-contain" />
 * </div>
 * ```
 */
export function imageSizes(width: TailwindSize, o?: Options) {
  const w = `${IMAGE_SIZES[width]}px`;
  if (!o) return w;

  const xl2 = o["2xl"] ? `(min-width: ${DEVICE_SIZES["2xl"]}px) ${IMAGE_SIZES[o["2xl"]]}px, ` : "";
  const xl = o.xl ? `(min-width: ${DEVICE_SIZES.xl}px) ${IMAGE_SIZES[o.xl]}px, ` : "";
  const md = o.md ? `(min-width: ${DEVICE_SIZES.md}px) ${IMAGE_SIZES[o.md]}px, ` : "";
  const sm = o.sm ? `(min-width: ${DEVICE_SIZES.sm}px) ${IMAGE_SIZES[o.sm]}px, ` : "";
  return `${xl2}${xl}${md}${sm}${w}`;
}

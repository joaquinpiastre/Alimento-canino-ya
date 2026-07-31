import { cn } from "@/lib/utils";

export function Logo({
  className,
  height = 36,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <span className={cn("inline-block", className)} style={{ height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-horizontal.svg"
        alt="Alimento Canino Ya"
        height={height}
        className="block h-full w-auto dark:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-horizontal-oscuro.svg"
        alt="Alimento Canino Ya"
        height={height}
        className="hidden h-full w-auto dark:block"
      />
    </span>
  );
}

export function LogoMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/isotipo.svg"
      alt="Alimento Canino Ya"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      style={{ height: size, width: size }}
    />
  );
}

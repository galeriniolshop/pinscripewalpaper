import type { SVGProps } from "react";

type IconName = "search" | "arrow-right" | "arrow-up-right" | "sun" | "heart" | "download" | "external" | "close" | "sparkles" | "check" | "bookmark" | "refresh";

type Props = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  filled?: boolean;
};

export function Icon({ name, size = 20, strokeWidth = 1.8, filled = false, ...props }: Props) {
  const shared = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    ...props,
  };

  switch (name) {
    case "search":
      return <svg {...shared}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg>;
    case "arrow-right":
      return <svg {...shared}><path d="M4.5 12h14" /><path d="m12.5 5.5 6.5 6.5-6.5 6.5" /></svg>;
    case "arrow-up-right":
      return <svg {...shared}><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>;
    case "sun":
      return <svg {...shared}><circle cx="12" cy="12" r="4" /><path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56m11.02 11.02 1.56 1.56M2 12h2.2m15.6 0H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56" /></svg>;
    case "heart":
      return <svg {...shared} fill={filled ? "currentColor" : "none"}><path d="M20.8 8.6c0 5.2-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.6A4.6 4.6 0 0 1 12 6.5a4.6 4.6 0 0 1 8.8 2.1Z" /></svg>;
    case "download":
      return <svg {...shared}><path d="M12 3.5v11" /><path d="m7.5 10.5 4.5 4.5 4.5-4.5" /><path d="M4.5 17.5v2a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-2" /></svg>;
    case "external":
      return <svg {...shared}><path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></svg>;
    case "close":
      return <svg {...shared}><path d="m18 6-12 12M6 6l12 12" /></svg>;
    case "sparkles":
      return <svg {...shared}><path d="m12 3 1.35 5.05L18.5 10l-5.15 1.95L12 17l-1.35-5.05L5.5 10l5.15-1.95L12 3Z" /><path d="m19 14 .72 2.28L22 17l-2.28.72L19 20l-.72-2.28L16 17l2.28-.72L19 14ZM5 2l.62 1.88L7.5 4.5l-1.88.62L5 7l-.62-1.88L2.5 4.5l1.88-.62L5 2Z" /></svg>;
    case "check":
      return <svg {...shared}><path d="m5 12 4.5 4.5L19 7" /></svg>;
    case "bookmark":
      return <svg {...shared} fill={filled ? "currentColor" : "none"}><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21V4.8Z" /></svg>;
    case "refresh":
      return <svg {...shared}><path d="M20 7v5h-5" /><path d="M4.7 9A7.5 7.5 0 0 1 18 5.2L20 7M4 17v-5h5" /><path d="M19.3 15A7.5 7.5 0 0 1 6 18.8L4 17" /></svg>;
  }
}

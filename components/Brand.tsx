import Link from "next/link";
import { Icon } from "@/components/Icons";

type Props = { variant?: "light" | "dark" };

export function Brand({ variant = "dark" }: Props) {
  return (
    <Link className={`brand brand--${variant}`} href="/" aria-label="RONA, kembali ke beranda">
      <span className="brand-mark"><Icon name="sun" size={21} strokeWidth={1.7} /></span>
      <span className="brand-name">rona<span>.</span></span>
      <span className="brand-divider" />
      <span className="brand-caption">WALLPAPER<br />STUDIO</span>
    </Link>
  );
}

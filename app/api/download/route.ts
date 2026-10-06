import { NextResponse } from "next/server";
import { isTrustedPinterestImageUrl } from "@/lib/pinterest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_BYTES = 4 * 1024 * 1024;

function safeFilename(value: string): string {
  const base = value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 54);
  return base || "rona-wallpaper";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("src") ?? "";
  const name = safeFilename(searchParams.get("name") ?? "rona-wallpaper");

  if (!isTrustedPinterestImageUrl(source)) {
    return NextResponse.json({ error: "Sumber gambar tidak diizinkan." }, { status: 400 });
  }

  try {
    const response = await fetch(source, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RONA-Wallpaper/1.0)",
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Referer": "https://www.pinterest.com/",
      },
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok || !isTrustedPinterestImageUrl(response.url)) {
      return NextResponse.json({ error: "Gambar sumber tidak bisa diunduh." }, { status: 502 });
    }

    const contentType = response.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Respons sumber bukan gambar." }, { status: 415 });
    }

    const advertisedLength = Number(response.headers.get("content-length") ?? 0);
    if (advertisedLength > MAX_BYTES) {
      return NextResponse.json({ error: "File terlalu besar untuk diunduh lewat RONA." }, { status: 413 });
    }

    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: "File terlalu besar untuk diunduh lewat RONA." }, { status: 413 });
    }

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(bytes.byteLength),
        "Content-Disposition": `attachment; filename="${name}.jpg"; filename*=UTF-8''${encodeURIComponent(`${name}.jpg`)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unduhan gagal. Coba buka sumber gambar di Pinterest." }, { status: 502 });
  }
}

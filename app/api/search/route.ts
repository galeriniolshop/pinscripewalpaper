import { NextResponse } from "next/server";
import { fallbackForQuery, type Wallpaper } from "@/lib/wallpapers";
import { isTrustedPinterestImageUrl, isTrustedPinterestPageUrl } from "@/lib/pinterest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const PINTEREST_BASE = "https://in.pinterest.com";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36";
const RESULT_LIMIT = 30;

function quotePlus(value: string): string {
  return encodeURIComponent(value)
    .replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/%20/g, "+");
}

function cookiesFromResponse(headers: Headers): string {
  const cookieHeaders = typeof headers.getSetCookie === "function"
    ? headers.getSetCookie()
    : [headers.get("set-cookie") ?? ""];
  return cookieHeaders.map((cookie) => cookie.split(";")[0]).filter(Boolean).join("; ");
}

function pinterestHeaders(sourceUrl: string, cookie?: string): Record<string, string> {
  return {
    "User-Agent": USER_AGENT,
    "Accept": "application/json, text/javascript, */*, q=0.01",
    "Accept-Language": "en-US,en;q=0.9",
    "X-Requested-With": "XMLHttpRequest",
    "X-Pinterest-Source-Url": sourceUrl,
    "X-Pinterest-Appstate": "active",
    "X-Pinterest-Pws-Handler": "www/search/[scope].js",
    "Sec-Ch-Ua": '"Chromium";v="139", "Not/A)Brand";v="24"',
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Referer": `${PINTEREST_BASE}/`,
    ...(cookie ? { Cookie: cookie } : {}),
  };
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function imageUrlFrom(result: Record<string, unknown>): string | undefined {
  const images = result.images;
  if (!images || typeof images !== "object") return undefined;
  const imageSet = images as Record<string, unknown>;
  const candidates = [imageSet.orig, imageSet["736x"], imageSet["564x"], imageSet["474x"], imageSet["236x"]];
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const url = readString((candidate as Record<string, unknown>).url);
    if (url && isTrustedPinterestImageUrl(url)) return url;
  }
  return undefined;
}

function toWallpaper(result: Record<string, unknown>, index: number): Wallpaper | null {
  const url = imageUrlFrom(result);
  if (!url) return null;

  const pinId = readString(result.id) ?? readString(result.pin_id);
  const rawLink = readString(result.link);
  const sourceUrl = pinId
    ? `https://www.pinterest.com/pin/${encodeURIComponent(pinId)}/`
    : rawLink && isTrustedPinterestPageUrl(rawLink) ? rawLink : undefined;
  const title = readString(result.grid_title)
    ?? readString(result.title)
    ?? readString(result.auto_alt_text)
    ?? readString(result.description)
    ?? `Wallpaper inspirasi ${index + 1}`;

  return {
    id: pinId ? `pin-${pinId}` : `pin-${index}-${url.slice(-22)}`,
    url,
    title: title.slice(0, 140),
    description: readString(result.description)?.slice(0, 240),
    sourceUrl,
    source: "pinterest",
  };
}

async function searchPinterest(query: string): Promise<Wallpaper[]> {
  const sourceUrl = `/search/pins/?q=${encodeURIComponent(query)}&rs=typed`;
  const warmup = await fetch(`${PINTEREST_BASE}${sourceUrl}`, {
    method: "GET",
    headers: pinterestHeaders(sourceUrl),
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(8_000),
  });
  const cookie = cookiesFromResponse(warmup.headers);
  if (warmup.body) void warmup.body.cancel().catch(() => undefined);
  if (warmup.status === 429 || warmup.status >= 500) {
    throw new Error(`Pinterest warm-up returned ${warmup.status}`);
  }

  const payload = {
    options: {
      applied_unified_filters: null,
      appliedProductFilters: "---",
      article: null,
      auto_correction_disabled: false,
      corpus: null,
      customized_rerank_type: null,
      domains: null,
      filters: null,
      journey_depth: null,
      page_size: `${RESULT_LIMIT}`,
      price_max: null,
      price_min: null,
      query_pin_sigs: null,
      query: encodeURIComponent(query),
      redux_normalize_feed: true,
      request_params: null,
      rs: "typed",
      scope: "pins",
      selected_one_bar_modules: null,
      source_id: null,
      source_module_id: null,
      seoDrawerEnabled: false,
      source_url: quotePlus(sourceUrl),
      top_pin_id: null,
      top_pin_ids: null,
    },
    context: {},
  };

  let encodedData = quotePlus(JSON.stringify(payload).replace(/ /g, ""));
  encodedData = encodedData
    .replace(/%2520/g, "%20")
    .replace(/%252F/g, "%2F")
    .replace(/%253F/g, "%3F")
    .replace(/%252520/g, "%2520")
    .replace(/%253D/g, "%3D")
    .replace(/%2526/g, "%26");

  const apiUrl = `${PINTEREST_BASE}/resource/BaseSearchResource/get/?source_url=${quotePlus(sourceUrl)}&data=${encodedData}&_=${Date.now()}`;
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: pinterestHeaders(sourceUrl, cookie),
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Pinterest search returned ${response.status}`);

  const payloadResult: unknown = await response.json();
  if (!payloadResult || typeof payloadResult !== "object") return [];
  const resource = (payloadResult as Record<string, unknown>).resource_response;
  if (!resource || typeof resource !== "object") return [];
  const data = (resource as Record<string, unknown>).data;
  if (!data || typeof data !== "object") return [];
  const rawResults = (data as Record<string, unknown>).results;
  if (!Array.isArray(rawResults)) return [];

  const found: Wallpaper[] = [];
  const seen = new Set<string>();
  rawResults.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const wallpaper = toWallpaper(item as Record<string, unknown>, index);
    if (!wallpaper || seen.has(wallpaper.url)) return;
    seen.add(wallpaper.url);
    found.push(wallpaper);
  });
  return found.slice(0, RESULT_LIMIT);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, 80);
  if (!query) {
    return NextResponse.json({ error: "Masukkan kata kunci pencarian." }, { status: 400 });
  }

  let pinterestError = false;
  try {
    const images = await searchPinterest(query);
    if (images.length > 0) {
      return NextResponse.json(
        { query, images, source: "pinterest", isFallback: false, message: null },
        { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } },
      );
    }
  } catch (error) {
    pinterestError = true;
    console.warn("Pinterest image search unavailable:", error instanceof Error ? error.message : "unknown error");
  }

  const fallback = fallbackForQuery(query);
  const message = fallback.length
    ? "Pinterest sedang membatasi atau tidak mengembalikan hasil. Pratinjau wallpaper tetap tersedia."
    : pinterestError
      ? "Pinterest belum bisa dihubungi. Coba lagi sebentar atau gunakan kata kunci lain."
      : "Belum ada gambar yang bisa ditampilkan untuk kata kunci ini. Coba kata kunci yang lebih umum.";

  return NextResponse.json(
    { query, images: fallback, source: fallback.length ? "local" : "none", isFallback: fallback.length > 0, message },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" } },
  );
}

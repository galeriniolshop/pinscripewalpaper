"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Brand } from "@/components/Brand";
import { Icon } from "@/components/Icons";
import { SearchForm } from "@/components/SearchForm";
import { queryFromSlug, slugify, titleCase } from "@/lib/text";
import { fallbackForQuery, type Wallpaper } from "@/lib/wallpapers";

type Props = { slug: string };
type SearchResponse = {
  query?: string;
  images?: Wallpaper[];
  source?: "pinterest" | "local" | "none";
  isFallback?: boolean;
  message?: string | null;
};

const STORAGE_KEY = "rona-saved-wallpapers-v1";

function saveToBrowser(items: Wallpaper[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Saving still works for the current session if browser storage is unavailable.
  }
}

export default function ResultsPage({ slug }: Props) {
  const query = useMemo(() => queryFromSlug(slug), [slug]);
  const title = useMemo(() => titleCase(query), [query]);
  const localPreview = useMemo(() => fallbackForQuery(query), [query]);
  const [images, setImages] = useState<Wallpaper[]>(localPreview);
  const [isFallback, setIsFallback] = useState(localPreview.length > 0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState<Wallpaper[]>([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [activeImage, setActiveImage] = useState<Wallpaper | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const visibleImages = showSaved ? saved : images;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSaved(parsed.filter((item): item is Wallpaper => Boolean(item && typeof item.id === "string" && typeof item.url === "string")));
        }
      }
    } catch {
      // Ignore malformed or unavailable local storage.
    }
    setFavoritesLoaded(true);
  }, []);

  useEffect(() => {
    if (favoritesLoaded) saveToBrowser(saved);
  }, [saved, favoritesLoaded]);

  useEffect(() => {
    let cancelled = false;
    const preview = fallbackForQuery(query);
    setImages(preview);
    setIsFallback(preview.length > 0);
    setMessage(null);
    setDownloadMessage(null);
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as SearchResponse;
        if (!response.ok) throw new Error(data.message ?? "Pencarian belum berhasil.");
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.images && data.images.length > 0) {
          setImages(data.images);
          setIsFallback(Boolean(data.isFallback));
        } else {
          setImages(preview);
          setIsFallback(preview.length > 0);
        }
        setMessage(data.message ?? null);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setImages(preview);
        setIsFallback(preview.length > 0);
        setMessage(error instanceof Error ? error.message : "Pencarian gagal. Coba lagi sebentar.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [query]);

  useEffect(() => {
    if (!activeImage) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeImage]);

  function toggleSaved(image: Wallpaper) {
    setSaved((current) => current.some((item) => item.id === image.id)
      ? current.filter((item) => item.id !== image.id)
      : [image, ...current]);
  }

  async function downloadWallpaper(image: Wallpaper) {
    setDownloadMessage(null);
    setDownloadingId(image.id);
    try {
      let fileUrl = image.url;
      if (!image.url.startsWith("/")) {
        const response = await fetch(`/api/download?src=${encodeURIComponent(image.url)}&name=${encodeURIComponent(`rona-${slugify(image.title || query)}`)}`);
        if (!response.ok) {
          const data = await response.json().catch(() => ({})) as { error?: string };
          throw new Error(data.error ?? "Unduhan belum tersedia.");
        }
        fileUrl = URL.createObjectURL(await response.blob());
      }

      const anchor = document.createElement("a");
      anchor.href = fileUrl;
      anchor.download = `rona-${slugify(image.title || query) || "wallpaper"}.jpg`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      if (fileUrl.startsWith("blob:")) window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1200);
    } catch (error) {
      setDownloadMessage(error instanceof Error ? error.message : "Unduhan gagal. Buka sumber Pinterest untuk menyimpan gambar.");
    } finally {
      setDownloadingId(null);
    }
  }

  function isSaved(image: Wallpaper) {
    return saved.some((item) => item.id === image.id);
  }

  return (
    <main className="results-page">
      <header className="results-header">
        <div className="results-header-inner page-container">
          <Brand variant="dark" />
          <SearchForm compact initialValue={query} placeholder="Cari mood lain..." />
          <div className="results-header-actions">
            <button className={`saved-filter${showSaved ? " is-active" : ""}`} onClick={() => setShowSaved((value) => !value)} type="button" aria-pressed={showSaved}>
              <Icon name="heart" size={17} filled={showSaved} /><span>Tersimpan</span><b>{saved.length}</b>
            </button>
            <Link className="back-home-link" href="/#jelajah"><span>Jelajahi</span><Icon name="arrow-up-right" size={16} /></Link>
          </div>
        </div>
      </header>

      <section className="results-intro page-container">
        <div className="results-breadcrumb"><Link href="/">BERANDA</Link><span>/</span><span>WALLPAPER SEARCH</span></div>
        <div className="results-title-row">
          <div className="results-title-copy">
            <div className="results-eyebrow"><span className={`status-dot${loading ? " status-dot--pulse" : ""}`} /> WALLPAPER SEARCH <span className="results-eyebrow-index">/ 01</span></div>
            <h1>Inspirasi untuk<br /><em>{title || "Kata Kunci"}</em></h1>
            <p>Galeri visual pilihan yang dimulai dari satu kata sederhana.</p>
          </div>
          <div className="results-summary">
            <div className="summary-number">{showSaved ? saved.length : images.length.toString().padStart(2, "0")}</div>
            <div><span>{showSaved ? "SAVED MOODS" : "WALLPAPERS"}</span><small>{showSaved ? "Favorit di perangkat ini" : isFallback ? "Pratinjau kurasi RONA" : "Ditemukan untukmu"}</small></div>
          </div>
        </div>

        <div className="results-toolbar">
          <div className="source-line">
            <span className={`source-pill${isFallback ? " source-pill--local" : ""}`}><i />{isFallback ? "RONA preview" : "Pinterest search"}</span>
            {loading && <span className="searching-note"><span className="mini-spinner" /> Memeriksa hasil terbaru...</span>}
            {!loading && message && !isFallback && <span className="searching-note">Hasil terbatas</span>}
          </div>
          <div className="toolbar-right"><span>Keyword</span><b>{title}</b><span className="toolbar-divider" />
            <button className="sort-chip" onClick={() => setShowSaved((value) => !value)} type="button" aria-pressed={showSaved}>
              <Icon name={showSaved ? "bookmark" : "sparkles"} size={15} /> {showSaved ? "Lihat semua" : "Untuk kamu"}
            </button>
          </div>
        </div>

        {message && (
          <div className={`results-notice${isFallback ? " results-notice--soft" : ""}`} role="status">
            <span className="notice-mark"><Icon name="sparkles" size={17} /></span>
            <p>{message}</p>
            {loading && <span className="mini-spinner" />}
          </div>
        )}
        {downloadMessage && <div className="download-notice" role="status">{downloadMessage} {images.find((image) => image.sourceUrl)?.sourceUrl && <a href={images.find((image) => image.sourceUrl)?.sourceUrl} target="_blank" rel="noreferrer">Buka sumber Pinterest <Icon name="arrow-up-right" size={13} /></a>}</div>}
      </section>

      <section className="gallery-section page-container" aria-label={`Hasil wallpaper ${title}`}>
        {loading && images.length === 0 && !showSaved ? (
          <div className="wallpaper-gallery wallpaper-gallery--skeleton" aria-label="Memuat gambar">
            {Array.from({ length: 12 }, (_, index) => <div className={`skeleton-card skeleton-card--${index % 4}`} key={index}><span /></div>)}
          </div>
        ) : visibleImages.length > 0 ? (
          <div className="wallpaper-gallery">
            {visibleImages.map((image, index) => (
              <article className="wallpaper-card" key={`${image.id}-${index}`}>
                <button className={`wallpaper-photo-button wallpaper-photo-button--${index % 6}`} type="button" onClick={() => setActiveImage(image)} aria-label={`Lihat wallpaper ${image.title}`}>
                  <img src={image.url} alt={image.title} loading={index < 4 ? "eager" : "lazy"} decoding="async" />
                  <span className="wallpaper-photo-wash" />
                  <span className="wallpaper-view-tag"><Icon name="external" size={14} /> LIHAT GAMBAR</span>
                  <span className="wallpaper-image-title">{image.title}</span>
                </button>
                <div className="wallpaper-card-footer">
                  <div className="wallpaper-card-text"><span>{image.source === "local" ? "RONA MOODBOARD" : "PINTEREST FIND"}</span><h2>{image.title}</h2></div>
                  <div className="wallpaper-card-actions">
                    <button className={`round-action${isSaved(image) ? " round-action--saved" : ""}`} type="button" onClick={() => toggleSaved(image)} aria-label={isSaved(image) ? "Hapus dari tersimpan" : "Simpan wallpaper"} title={isSaved(image) ? "Tersimpan" : "Simpan wallpaper"}>
                      <Icon name="heart" size={17} filled={isSaved(image)} />
                    </button>
                    <button className="round-action" type="button" onClick={() => downloadWallpaper(image)} disabled={downloadingId === image.id} aria-label="Unduh wallpaper" title="Unduh wallpaper">
                      {downloadingId === image.id ? <span className="tiny-spinner" /> : <Icon name="download" size={17} />}
                    </button>
                    {image.sourceUrl && <a className="round-action" href={image.sourceUrl} target="_blank" rel="noreferrer" aria-label="Buka sumber Pinterest" title="Buka sumber Pinterest"><Icon name="arrow-up-right" size={17} /></a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><Icon name={showSaved ? "heart" : "search"} size={25} /></div>
            <span className="section-eyebrow">{showSaved ? "YOUR SAVED MOODS" : "NO IMAGES YET"}</span>
            <h2>{showSaved ? "Belum ada wallpaper tersimpan." : "Belum ada gambar untuk kata kunci ini."}</h2>
            <p>{showSaved ? "Ketuk ikon hati pada gambar untuk menyimpannya di perangkat ini." : "Coba kata kunci yang lebih singkat atau lebih umum, lalu cari lagi."}</p>
            {!showSaved && <button className="empty-retry" type="button" onClick={() => window.location.reload()}><Icon name="refresh" size={16} /> Coba lagi</button>}
          </div>
        )}
      </section>

      <div className="results-footnote page-container">
        <span><i /> GAMBAR DITEMUKAN MELALUI PINTEREST</span>
        <p>Hak cipta gambar tetap milik pemilik aslinya. Pastikan kamu memiliki izin sebelum menggunakan atau membagikan ulang.</p>
      </div>

      <footer className="results-footer page-container">
        <Brand variant="dark" />
        <span>RONA / Wallpaper discovery for your everyday mood.</span>
        <a href="https://github.com/galeriniolshop/pinscrape" target="_blank" rel="noreferrer">Inspired by pinscrape <Icon name="external" size={14} /></a>
      </footer>

      {activeImage && (
        <div className="lightbox-backdrop" onClick={() => setActiveImage(null)} role="presentation">
          <section className="lightbox-panel" role="dialog" aria-modal="true" aria-label={`Wallpaper ${activeImage.title}`} onClick={(event) => event.stopPropagation()}>
            <button className="lightbox-close" type="button" onClick={() => setActiveImage(null)} aria-label="Tutup"><Icon name="close" size={20} /></button>
            <div className="lightbox-image-wrap"><img src={activeImage.url} alt={activeImage.title} /></div>
            <div className="lightbox-details">
              <span className="section-eyebrow">{activeImage.source === "local" ? "RONA MOODBOARD" : "PINTEREST FIND"}</span>
              <h2>{activeImage.title}</h2>
              <p>{activeImage.description || "Simpan visual ini sebagai inspirasi untuk layar kamu."}</p>
              <button className="lightbox-download" type="button" onClick={() => downloadWallpaper(activeImage)} disabled={downloadingId === activeImage.id}>
                <Icon name="download" size={17} /> {downloadingId === activeImage.id ? "Menyiapkan..." : "Unduh wallpaper"}
              </button>
              <button className={`lightbox-save${isSaved(activeImage) ? " is-saved" : ""}`} type="button" onClick={() => toggleSaved(activeImage)}>
                <Icon name="heart" size={17} filled={isSaved(activeImage)} /> {isSaved(activeImage) ? "Tersimpan" : "Simpan ke favorit"}
              </button>
              {activeImage.sourceUrl && <a className="lightbox-source" href={activeImage.sourceUrl} target="_blank" rel="noreferrer">Buka pin asli di Pinterest <Icon name="arrow-up-right" size={15} /></a>}
              {downloadMessage && <p className="lightbox-error">{downloadMessage}</p>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

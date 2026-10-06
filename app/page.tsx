"use client";

import Link from "next/link";
import { Brand } from "@/components/Brand";
import { Icon } from "@/components/Icons";
import { SearchForm } from "@/components/SearchForm";

const moods = [
  {
    title: "Bunga matahari",
    category: "BOTANICAL · 01",
    image: "/wallpaper/sunflower-editorial.jpg",
    href: "/bunga-matahari",
    className: "mood-card--sunflower",
  },
  {
    title: "Golden hour",
    category: "WARM TONES · 02",
    image: "/wallpaper/sunflower-dusk.jpg",
    href: "/golden-hour",
    className: "mood-card--golden",
  },
  {
    title: "Botanical calm",
    category: "SLOW LIVING · 03",
    image: "/wallpaper/sunflower-minimal.jpg",
    href: "/botanical-minimal",
    className: "mood-card--calm",
  },
];

const steps = [
  { number: "01", title: "Tulis suasana", text: "Masukkan kata kunci sederhana—dari bunga matahari sampai midnight blue." },
  { number: "02", title: "Jelajahi hasil", text: "Lihat galeri visual yang dicari otomatis dari Pinterest, langsung lewat satu tautan." },
  { number: "03", title: "Simpan favorit", text: "Tandai gambar yang kamu suka, lalu unduh untuk menghiasi layar." },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="hero" id="atas">
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-glow hero-glow--one" aria-hidden="true" />
        <div className="hero-glow hero-glow--two" aria-hidden="true" />

        <header className="site-header page-container">
          <Brand variant="light" />
          <nav className="hero-nav" aria-label="Navigasi utama">
            <a href="#jelajah">Inspirasi</a>
            <a href="#cara-kerja">Cara kerja</a>
          </nav>
          <a className="header-cta" href="#jelajah">
            <span>Mulai eksplorasi</span><Icon name="arrow-up-right" size={18} />
          </a>
        </header>

        <div className="hero-layout page-container">
          <div className="hero-copy">
            <div className="hero-eyebrow"><span className="eyebrow-line" /> WALLPAPER DISCOVERY <span className="eyebrow-index">01 / 03</span></div>
            <h1>Temukan gambar.<br /><em>Temukan suasana.</em></h1>
            <p className="hero-description">Satu kata kunci bisa membuka banyak kemungkinan. Cari wallpaper yang terasa paling kamu—lalu bawa suasananya ke layar.</p>

            <SearchForm />

            <div className="quick-searches">
              <span className="quick-label">MULAI DARI</span>
              <div className="quick-list">
                {["bunga matahari", "laut senja", "minimalist nature"].map((term) => (
                  <Link href={`/${term.replace(/\s+/g, "-")}`} key={term}>{term}<Icon name="arrow-up-right" size={13} /></Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-art" aria-label="Inspirasi wallpaper bunga matahari">
            <div className="hero-art-orbit" aria-hidden="true" />
            <div className="hero-photo-frame">
              <img src="/wallpaper/sunflower-editorial.jpg" alt="Bunga matahari keemasan dengan latar hijau gelap" />
              <div className="hero-photo-shade" />
              <div className="hero-photo-topline"><span>WALLPAPER STUDY</span><span>NO. 024</span></div>
              <div className="hero-photo-caption">
                <span>BOTANICAL / GOLDEN HOUR</span>
                <strong>Let the light<br />find you.</strong>
              </div>
            </div>
            <div className="hero-float-note"><span className="float-note-icon"><Icon name="sparkles" size={18} /></span><span><b>Made for your mood</b><small>Temukan visual berikutnya</small></span></div>
            <div className="hero-float-photo">
              <img src="/wallpaper/sunflower-minimal.jpg" alt="Close-up bunga matahari bernuansa lembut" />
              <span className="float-photo-label"><i /> 4K MOODBOARD</span>
            </div>
            <div className="hero-side-index" aria-hidden="true">RONA / IMAGE SEARCH / 2026</div>
          </div>
        </div>

        <div className="hero-bottom page-container">
          <span className="hero-bottom-label"><i /> SCROLL TO EXPLORE</span>
          <div className="hero-bottom-rule" />
          <span className="hero-bottom-note">INSPIRED BY YOUR NEXT SEARCH</span>
        </div>
      </section>

      <section className="discovery-section" id="jelajah">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <div className="section-eyebrow"><span>CURATED STARTING POINTS</span><span>— 01</span></div>
              <h2>Mulai dari <em>mood</em><br />favoritmu.</h2>
            </div>
            <p>Belum tahu mau mencari apa? Pilih suasana, temukan inspirasi, dan biarkan layar bercerita.</p>
          </div>

          <div className="mood-grid">
            {moods.map((mood, index) => (
              <Link className={`mood-card ${mood.className}`} href={mood.href} key={mood.title}>
                <img src={mood.image} alt={`Inspirasi wallpaper ${mood.title}`} loading="lazy" />
                <div className="mood-card-shade" />
                <div className="mood-card-top"><span>{mood.category}</span><span className="mood-number">0{index + 1}</span></div>
                <div className="mood-card-bottom"><div><span>EXPLORE MOOD</span><h3>{mood.title}</h3></div><span className="mood-arrow"><Icon name="arrow-up-right" size={20} /></span></div>
              </Link>
            ))}
          </div>

          <div className="how-section" id="cara-kerja">
            <div className="how-intro">
              <span className="section-eyebrow">SIMPLE BY DESIGN <span>— 02</span></span>
              <h2>Temukan. Pilih.<br /><em>Jadikan milikmu.</em></h2>
              <p>RONA mengubah pencarian sederhana menjadi ruang kecil untuk menemukan visual yang kamu suka.</p>
            </div>
            <div className="steps-list">
              {steps.map((step) => (
                <div className="step-row" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                  <span className="step-mark"><Icon name="arrow-up-right" size={18} /></span>
                </div>
              ))}
            </div>
          </div>

          <div className="closing-banner">
            <div className="closing-decoration"><Icon name="sun" size={44} strokeWidth={1.2} /></div>
            <div><span className="section-eyebrow">YOUR NEXT WALLPAPER IS A WORD AWAY</span><h2>Apa yang ingin kamu lihat hari ini?</h2></div>
            <a href="#atas" className="closing-link">Mulai mencari <Icon name="arrow-up-right" size={18} /></a>
          </div>
        </div>
      </section>

      <footer className="site-footer page-container">
        <Brand variant="dark" />
        <span>Temukan suasana baru, satu kata kunci pada satu waktu.</span>
        <a href="https://github.com/galeriniolshop/pinscrape" target="_blank" rel="noreferrer">Search flow adapted from pinscrape <Icon name="external" size={14} /></a>
      </footer>
    </main>
  );
}

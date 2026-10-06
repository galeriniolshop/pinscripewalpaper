export type Wallpaper = {
  id: string;
  url: string;
  title: string;
  description?: string;
  sourceUrl?: string;
  source?: "pinterest" | "local";
};

export const SUNFLOWER_WALLPAPERS: Wallpaper[] = [
  {
    id: "local-sunflower-editorial",
    url: "/wallpaper/sunflower-editorial.jpg",
    title: "Sunflower in the wild",
    description: "Sinar pagi di antara kelopak keemasan.",
    source: "local",
  },
  {
    id: "local-sunflower-dusk",
    url: "/wallpaper/sunflower-dusk.jpg",
    title: "Golden hour field",
    description: "Ladang bunga dalam cahaya senja.",
    source: "local",
  },
  {
    id: "local-sunflower-minimal",
    url: "/wallpaper/sunflower-minimal.jpg",
    title: "Soft botanical",
    description: "Palet hangat untuk layar yang lebih tenang.",
    source: "local",
  },
];

export function fallbackForQuery(query: string): Wallpaper[] {
  const normalized = query
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  if (/bunga|matahari|sunflower/.test(normalized)) return SUNFLOWER_WALLPAPERS;
  if (/golden|sunset|senja|warm/.test(normalized)) return SUNFLOWER_WALLPAPERS.slice(1, 2).concat(SUNFLOWER_WALLPAPERS.slice(0, 1));
  if (/botanical|nature|alam|green|hijau/.test(normalized)) return [SUNFLOWER_WALLPAPERS[0], SUNFLOWER_WALLPAPERS[2]];
  return [];
}

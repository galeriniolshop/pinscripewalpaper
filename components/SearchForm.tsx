"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/text";
import { Icon } from "@/components/Icons";

type Props = {
  initialValue?: string;
  compact?: boolean;
  placeholder?: string;
};

export function SearchForm({ initialValue = "", compact = false, placeholder = "Cari apa hari ini? Contoh: bunga matahari" }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  useEffect(() => setValue(initialValue), [initialValue]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slug = slugify(value);
    if (!slug) return;
    router.push(`/${encodeURIComponent(slug)}`);
  }

  return (
    <form className={`search-form${compact ? " search-form--compact" : ""}`} onSubmit={submit} role="search">
      <span className="search-form-icon"><Icon name="search" size={21} strokeWidth={1.8} /></span>
      <input
        aria-label="Kata kunci wallpaper"
        autoComplete="off"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        maxLength={80}
      />
      <button className="search-form-submit" type="submit" aria-label="Cari wallpaper">
        {compact ? <Icon name="arrow-right" size={19} /> : <><span>Temukan wallpaper</span><Icon name="arrow-right" size={19} /></>}
      </button>
    </form>
  );
}

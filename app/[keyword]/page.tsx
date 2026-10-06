import type { Metadata } from "next";
import ResultsPage from "@/components/ResultsPage";
import { queryFromSlug, titleCase } from "@/lib/text";

type Props = { params: Promise<{ keyword: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { keyword } = await params;
  const query = titleCase(queryFromSlug(keyword));
  return {
    title: `${query} wallpaper — RONA`,
    description: `Jelajahi inspirasi wallpaper untuk ${query} di RONA.`,
  };
}

export default async function KeywordPage({ params }: Props) {
  const { keyword } = await params;
  return <ResultsPage slug={keyword} />;
}

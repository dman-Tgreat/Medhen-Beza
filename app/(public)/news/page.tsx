import * as React from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Hero";
import { NewsDirectoryClient } from "@/components/public/NewsDirectoryClient";
import { getPublicNews, getPublicSiteSettings } from "@/lib/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    title: "Hospital News, Medical Advances & Health Articles",
    description: `Stay informed with the latest medical news, specialized clinical updates, community health outreach, and physician insights from ${settings.hospitalName}.`,
  };
}

export default async function NewsPage() {
  const news = await getPublicNews();

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title="News, Research & Health Updates"
        description="Discover the latest medical breakthroughs, clinical advancements, hospital announcements, and health wellness advice from our expert physicians."
        badge="Hospital News"
      />

      <NewsDirectoryClient initialNews={news} />
    </div>
  );
}

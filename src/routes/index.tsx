import { createFileRoute } from "@tanstack/react-router";
import { NurtureApp } from "@/components/nurture-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nurture Sapling — Home Gardening" },
      { name: "description", content: "Plan a small-space garden, explore Indian household crops, and track plant care with Nurture Sapling." },
      { property: "og:title", content: "Nurture Sapling — Home Gardening" },
      { property: "og:description", content: "Practical, local-first guidance for growing nutritious food at home." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NurtureApp,
});
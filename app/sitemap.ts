import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.rhythmnyogawellness.in/",
      lastModified: new Date(),
    },
  ];
}

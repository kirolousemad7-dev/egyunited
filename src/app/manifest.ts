import type { MetadataRoute } from "next";
import ar from "@/messages/ar.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: ar.Common.nameAr,
    short_name: "ايجي يونايتد",
    description: ar.Metadata.description,
    start_url: "/ar",
    display: "standalone",
    background_color: "#08090B",
    theme_color: "#08090B",
    lang: "ar",
    dir: "rtl",
  };
}

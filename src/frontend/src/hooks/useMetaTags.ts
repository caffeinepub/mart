import { useEffect, useRef } from "react";

interface MetaTagOptions {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
}

const setMeta = (name: string, content: string, prop = false) => {
  const selector = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    if (prop) el.setAttribute("property", name);
    else el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export function useMetaTags(options: MetaTagOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const { title, description, ogTitle, ogDescription, ogImage, ogType } =
      optionsRef.current;
    const siteName = "धर्मा Mart - भारत का अपना Mart";

    if (title) document.title = `${title} | धर्मा Mart`;

    if (description) setMeta("description", description.slice(0, 160));
    setMeta("og:site_name", siteName, true);
    if (ogTitle || title)
      setMeta("og:title", ogTitle ?? title ?? siteName, true);
    if (ogDescription ?? description)
      setMeta(
        "og:description",
        (ogDescription ?? description ?? "").slice(0, 160),
        true,
      );
    if (ogImage) {
      setMeta("og:image", ogImage, true);
      setMeta("twitter:card", "summary_large_image");
      setMeta("twitter:image", ogImage);
    } else {
      setMeta("twitter:card", "summary");
    }
    setMeta("og:type", ogType ?? "website", true);
    if (ogTitle ?? title) setMeta("twitter:title", ogTitle ?? title ?? "");
    if (ogDescription ?? description)
      setMeta(
        "twitter:description",
        (ogDescription ?? description ?? "").slice(0, 160),
      );
  });
}

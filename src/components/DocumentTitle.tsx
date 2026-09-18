"use client";

import { useEffect } from "react";
import { useLanguage } from "@/lib/language-context";

/** Keeps the browser tab title/description in sync with the active language. */
export function DocumentTitle() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t.meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", t.meta.description);
    }
  }, [t]);

  return null;
}

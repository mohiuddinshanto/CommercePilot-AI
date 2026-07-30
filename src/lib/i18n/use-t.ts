import { useLanguage } from "@/providers/language-provider";
import { t } from "@/lib/i18n/translations";

export function useT() {
  const { lang } = useLanguage();

  const T = (key: string, fallback?: string): string => {
    return t(lang, key, fallback);
  };

  return T;
}

export type Category = 'политика' | 'экономика' | 'спорт' | 'технологии' | 'общество' | 'культура';

export interface RitualItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  source: string; // бренд источника
  canonicalUrl: string; // ссылка на оригинал
  publishedAt: string; // ISO
  category: Category[];
  previewHtml: string; // 2–3 абзаца анонса/OG
}

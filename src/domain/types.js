// @ts-check
// src/domain/types.js
// MUST 85, 86, 87, 88: Вся логика контракта.

import { z } from 'zod';

// MUST 86: Проверка на наличие HTML-тегов (<...>)
const NoHtmlSchema = z.string().refine(val => {
  return !/<[^>]*>/g.test(val);
}, {
  message: 'HTML tags are forbidden in this field (Security/DQM).',
});

// MUST 84/85: Категории (теги)
/** @typedef {'политика'|'экономика'|'спорт'|'технологии'|'общество'|'культура'} Category */
export const CategorySchema = z.enum([
  'политика',
  'экономика',
  'спорт',
  'технологии',
  'общество',
  'культура',
]);

export const NewsItemSchema = z.object({
  id: z.string().uuid(),
  // MUST 85, 86: Длина и запрет HTML
  title: NoHtmlSchema.min(1).max(256),
  // MUST 85, 86: Длина и запрет HTML
  summary: NoHtmlSchema.min(1).max(1024),
  image: z.string().url().startsWith('/images/news/', { message: 'Image URL must start with /images/news/' }),
  source: z.string().min(1).max(128),
  // MUST 88: Требование HTTPS
  canonicalUrl: z.string().url().max(512).startsWith('https://', { message: 'URL must use HTTPS protocol.' }), 
  // MUST 87: Строгая проверка ISO8601 UTC (с Z)
  publishedAt: z.string().datetime({ offset: true }),
  // MUST 85: Ограничение числа тегов (min 1, max 3)
  category: z.array(CategorySchema).min(1).max(3),
  previewHtml: z.string().optional(),
  ttsAvailable: z.boolean().default(false),
  bookmarked: z.boolean().default(false),
});

// MUST 82: Корневая схема (NewsFeed)
export const NewsFeedSchema = z.object({
  timestamp: z.string().datetime({ offset: true }), 
  normalizedCount: z.number().int().min(0),
  totalUniqueCount: z.number().int().min(0),
  news: z.array(NewsItemSchema),
});

// Экспортируем все схемы и типы
export default {
    NewsItemSchema,
    NewsFeedSchema,
    CategorySchema
};

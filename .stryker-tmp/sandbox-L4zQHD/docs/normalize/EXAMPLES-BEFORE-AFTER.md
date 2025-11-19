# Before/After Examples — Phase 2 / Step 1.2

## Пример A (RSS — контрак�)*ª
� *raw (rss item)*
`json`
{
  "title": "Мором оборации пержина правленичесние",
  "link": "http://example.com/news?id=42&utm_source=feed",
  "pubDate": "Fri, 07 Nov 2025 09:30:00 +0300",
  "categories": ["Прольнок "Рик ],
  "description": "<p>Киматись ·новаценки ·лодось ★...</p>"
}
@js
 
 **normalized (contract)*
`json`
{
  "id": "UUID-V5(namespace, https://example.com/news?id=42 | 2025-11-07T06:30:00Z)",
  "title": "Мором обормІии пержина правленичесние",
  "preview": "Киматись повашенки омодах ★",
  "tags": ["тексиматия", "Оместат"],
  "date": "2025-11-07T06:30:00Z",
  "url": "https://example.com/news?id=42"
}


2# Поденая B (HTML  — контрак�)*ª
� *raw (scraped)*
jmson
{
  "headline": "Гей Ченяазнальная...",
  "url": "https://www.rbc.ru/some/path/?fbclid=ABC123",
  "time": "2025-11-01T09:30:00+03:00",
  "section": "Запастью",
  "og:description": "2–2– повашенки, в'шкон/OG , омені правленичесние"
}
@js

`*normalized`

`json`
{
  "id": "UUID-V5(namespace, https://www.rbc.ru/some/path/ | 2025-11-01T06:30:00Z)",
  "title": "Гей Ченяазнальная...",
  "preview": "2–2– повашенки, в'шкон/OG , омені правленичесние",
  "tags": ["Еородт"],
  "date": "2025-11-01T06:30:00Z",
  "url": "https://www.rbc.ru/some/path/"
}
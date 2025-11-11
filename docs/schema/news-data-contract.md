# News Data Contract (MiniApp)
Поля: id(uuid), title(10–180, без HTML), preview(≤240, без HTML), tags(1–5, 2–24), date(ISO8601 UTC …Z), url(https://).
Инварианты: уникальность id/url/title+date; сортировка по date DESC; запрет HTML.

// @ts-nocheck
type Props = { brand: string }

const LOGOS: Record<string, string> = {
  RBC: 'https://logo.clearbit.com/rbc.ru',
  BBC: 'https://logo.clearbit.com/bbc.com',
  // добавляй свои источники при необходимости
}

export function SourceChip({ brand }: Props) {
  const logo = LOGOS[brand] ?? ''
  return (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 ring-1 ring-white/10">
      {logo ? (
        <img
          src={logo}
          alt={brand}
          className="w-4 h-4 rounded-sm object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="w-4 h-4 rounded-sm bg-white/10" aria-hidden />
      )}
      <span className="text-xs opacity-80">{brand}</span>
    </span>
  )
}

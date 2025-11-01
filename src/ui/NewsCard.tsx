import type { NewsItem } from '../domain/types';

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-[var(--surface)] shadow-[var(--shadow)]">
      <div className="aspect-video bg-white/5">
        <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-4 space-y-2">
        <div className="text-xs text-white/60 flex gap-2"><span>{item.source}</span><span>•</span><time>{new Date(item.publishedAt).toLocaleDateString()}</time></div>
        <h3 className="text-base font-semibold line-clamp-2">{item.title}</h3>
        <p className="text-sm text-white/70 line-clamp-2">{item.summary}</p>
      </div>
    </article>
  );
}

export function NewsCardSkeleton(){
  return (
    <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-[var(--surface)] animate-pulse">
      <div className="aspect-video bg-white/5" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-24 bg-white/10 rounded" />
        <div className="h-4 w-4/5 bg-white/10 rounded" />
        <div className="h-3 w-3/4 bg-white/10 rounded" />
      </div>
    </div>
  );
}

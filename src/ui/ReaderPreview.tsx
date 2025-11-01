import { FEATURES } from "../config";
import { motion } from "framer-motion";

export function ReaderPreview({
  html,
  onOpenSource,
  onBookmark,
  onClose,
  onSpeak
}: {
  html: string; onOpenSource: ()=>void; onBookmark: ()=>void; onClose: ()=>void; onSpeak: ()=>void;
}) {
  if (!FEATURES.readerPreview) return null;
  return (
    <div className="fixed inset-0 grid place-items-center p-4" role="dialog" aria-modal="true">
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.article
        initial={{ opacity:0, scale: .98 }}
        animate={{ opacity:1, scale: 1 }}
        transition={{ duration: .16 }}
        className="relative w-[min(720px,95vw)] max-h-[85vh] overflow-auto rounded-2xl ring-1 ring-white/10 bg-[var(--surface)] p-6"
      >
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={onOpenSource} className="px-3 py-1.5 rounded-lg bg-white/10">Открыть источник</button>
          <button onClick={onBookmark} className="px-3 py-1.5 rounded-lg ring-1 ring-white/10">В закладки</button>
          <button onClick={onSpeak} className="px-3 py-1.5 rounded-lg ring-1 ring-white/10">🎧 Слушать</button>
          <button onClick={onClose} className="ml-auto px-3 py-1.5 rounded-lg bg-white/10">Закрыть</button>
        </div>
      </motion.article>
    </div>
  );
}

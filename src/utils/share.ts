// src/utils/share.ts
export async function shareLink(url: string, title?: string, text?: string) {
  try {
    if (navigator.share) {
      await navigator.share({ url, title, text })
      return true
    }
  } catch {
    // игнорируем — пойдём во fallback
  }
  try {
    await navigator.clipboard?.writeText(url)
    alert('Ссылка скопирована в буфер обмена')
    return true
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
    return false
  }
}

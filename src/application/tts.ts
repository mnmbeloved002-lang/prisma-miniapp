export function speakFromHtml(title: string, html: string){
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    alert('TTS недоступен в этом окружении.');
    return;
  }
  const text = strip(html);
  const u = new SpeechSynthesisUtterance(`${title}. ${text}`);
  u.lang = 'ru-RU';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
function strip(html: string){
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

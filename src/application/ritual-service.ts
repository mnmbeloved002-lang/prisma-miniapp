import type { Ritual } from '../domain/ritual-types'

const MOCK_RITUAL: Ritual = {
  id: "2025-11-20-mock",
  title: "Ритуал гармонии для Весов",
  motivation: "Сегодня звёзды дарят тебе ясность и баланс. Всё складывается в твою пользу.",
  task: "Сделай 3 глубоких вдоха и улыбнись своему отражению",
  affirmation: "Я в гармонии с миром",
  imagePrompt: "призма в лучах рассвета, пастельные тона, calm luxury"
}

export const loadTodayRitual = async (): Promise<Ritual> => {
  // Имитируем сеть (Suspense сработает)
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log('✅ Ritual загружен:', MOCK_RITUAL)
  return MOCK_RITUAL
}

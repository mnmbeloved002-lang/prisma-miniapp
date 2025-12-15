/**
 * Экспорт модулей игрового движка
 */

export {
  AVAILABLE_QUESTIONS,
  canResidentLie,
  getTruthfulAnswer,
  type InterrogationResult,
  interrogate,
} from './interrogation';

export {
  canKillerMurder,
  performTracking,
  type TrackingResult,
} from './tracking';

/**
 * Экспорт модулей игрового движка
 */

export {
  canResidentLie,
  getTruthfulAnswer,
  interrogate,
  AVAILABLE_QUESTIONS,
  type InterrogationResult,
} from './interrogation';

export {
  canKillerMurder,
  performTracking,
  type TrackingResult,
} from './tracking';

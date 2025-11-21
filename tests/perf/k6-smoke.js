import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20, // 20 виртуальных пользователей
  duration: '30s', // долбят сайт 30 секунд
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% запросов должны быть быстрее 500мс
  },
};

export default function () {
  // Стучимся в локальный превью-сервер (в CI он будет поднят)
  const res = http.get('http://localhost:4173');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'content present': (r) => r.body.includes('Prisma'),
  });
  sleep(1);
}

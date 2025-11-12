import http from 'k6/http';
import { sleep, check } from 'k6';
export const options = { vus: 5, duration: '30s', thresholds: { http_req_duration: ['p(95)<800'] } };
export default function () {
  const res = http.get(__ENV.TARGET || 'http://127.0.0.1:4173/');
  check(res, { 'status 200': r => r.status === 200 });
  sleep(1);
}

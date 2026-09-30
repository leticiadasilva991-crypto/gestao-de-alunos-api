import request from 'supertest';
import 'dotenv/config';

const baseUrl = process.env.BASE_URL;
const app = baseUrl ? null : (await import('../../src/app.js')).default;

export function api() {
    return request(baseUrl || app);
}
const request = require('supertest');
const { Pool } = require('pg');
const app = require('../../app');

describe('GET assets', () => {
    beforeAll(() => {
        require('dotenv').config();

        // ENTER YOUR TEST DB CONNECTION CONFIG HERE
        const dbConfig = {
            host: process.env.DATABASE_UNIX_SOCKET_DIR
        };

        global.dbPool = new Pool(dbConfig);
        global.pool = global.dbPool;
    });

    afterAll(() => {
        global.dbPool.end();
    });

    it('returns HTTP 200 response', (done) => {
        request(app)
            .get('/api/v1/assets')
            .end((err, res) => {
                expect(res.status).toBe(200);
                done();
            });
    });
});
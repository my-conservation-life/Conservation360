const request = require('supertest');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');

const ENDPOINT = '/api/v1/assets/properties/temporalSearch';

describe('POST assets/properties/temporalSearch', () => {

    const polygon_search = {
        'geometry': {
            'type': 'Polygon',
            'coordinates' : [[-16, 44], [-18, 44], [-18, 48], [-16, 48], [-16, 44]]
        },
        'sponsor': 'seneca park zoo society',
        'asset_type': 'fire',
        'project': 'Madagascar reforesting project'
    };

    const circle_search = {
        'geometry': {
            'type': 'Circle',
            'coordinates' : [-16, 44],
            'radius': '10000'
        },
        'start_date': '2020-05-20',
        'end_date': '2020-05-25'
    };

    beforeAll(async () => {
        jest.setTimeout(30000);
        await setup();
        await loadSQL('../schema/sample-data-emptyProjects.sql');
    });

    afterAll(async () => {
        await teardown();
    });

    afterEach(async () => {
        await global.dbPool.query('DELETE FROM asset');
    });

    it('returns HTTP 200 with "Polygon" search', async () => {
        await request(app)
            .post(ENDPOINT)
            .send(polygon_search)
            .expect(200);
    });

    it('returns HTTP 200 with "Circle" search', async () => {
        await request(app)
            .post(ENDPOINT)
            .send(circle_search)
            .expect(200);
    });
});

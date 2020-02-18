const { temporalSearch } = require('../temporal.db');
const moment = require('moment');

describe('temporal.db.temporalSearch', () => {
    let query;
    let rows;
    let geometry;

    beforeEach(() => {
        rows = [];
        query = jest.fn(async () => ({ rows }));
        global.dbPool = { query };
        geometry = {coordinates: [1, 2], type: 'Circle', radius: 500};
    });
    
    it('performs a ST_DWithin query when given a "Circle" geometry type', async () => {
        await temporalSearch(geometry, undefined, undefined, undefined, undefined, undefined, undefined);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('ST_DWithin'));
        expect(query.mock.calls[0][1]).toEqual(expect.arrayContaining(
            [1, 2, 500]
        ));
    });

    it('performs a ST_Within query when given a "Polygon" geometry type', async () => {
        geometry = {coordinates: [[1, 1], [2, 2], [3, 3], [1, 1]], type: 'Polygon'};
        await temporalSearch(geometry, undefined, undefined, undefined, undefined, undefined, undefined);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('ST_Within'));
        expect(query.mock.calls[0][1]).toEqual(expect.arrayContaining(
            ['LINESTRING(1 1,2 2,3 3,1 1)']
        ));
    });

    it('performs a query for asset properties after a start_date', async () => {
        const start_string = '2012-05-25';
        const start = moment(start_string, 'YYYY-MM-DD', true);

        await temporalSearch(geometry, undefined, undefined, undefined, undefined, start, undefined);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('history.date >='));
        expect(query.mock.calls[0][1]).toEqual(expect.arrayContaining(
            [start_string]
        ));
    });

    it('performs a query for asset properties before an end_date', async () => {
        const end_string = '2012-05-25'
        const end = moment(end_string, 'YYYY-MM-DD', true);

        await temporalSearch(geometry, undefined, undefined, undefined, undefined, undefined, end);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('history.date <='));
        expect(query.mock.calls[0][1]).toEqual(expect.arrayContaining(
            [end_string]
        ));
    });

    it('performs a query for asset properties between a start_date and an end_date', async () => {
        const start_string = '2012-05-20';
        const start = moment(start_string, 'YYYY-MM-DD', true);
        const end_string = '2012-05-25'
        const end = moment(end_string, 'YYYY-MM-DD', true);

        await temporalSearch(geometry, undefined, undefined, undefined, undefined, start, end);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('history.date BETWEEN'));
        expect(query.mock.calls[0][1]).toEqual(expect.arrayContaining(
            [start_string, end_string]
        ));
    });

    it('will further filter queries for sponsors, asset types, and project names', async () => {
        const sponsor_name = 'SponsorName';
        const asset_type = 'AssetType';
        const project_name = 'ProjectName';

        await temporalSearch(geometry, undefined, sponsor_name, asset_type, project_name, undefined, undefined);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('LOWER(sponsor.name)'));
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('LOWER(project.name)'));
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('LOWER(asset_type.name)'));
        expect(query.mock.calls[0][1]).toEqual(expect.arrayContaining(
            [sponsor_name, asset_type, project_name]
        ));
    });

    it('formats query results as GeoJson', async () => {
        rows = [{
            asset_id: 1, 
            asset_type: 'AssetType', 
            property: 'PropertyName', 
            value: 'PropertyValue', 
            date: '2020-05-20', 
            sponsor_name: 'SponsorName', 
            project_name: 'ProjectName',
            longitude: 1,
            latitude: 2
        }];

        const expectedGeoJson = {
            'type': 'FeatureCollection', 
            'features': [{
                'type': 'Feature',
                'geometry' : {
                    'type' : 'Point',
                    'coordinates' : [1, 2]
                },
                'properties': {
                    'asset_id' : 1,
                    'asset_type' : 'AssetType',
                    'asset_properties' : [{'property': 'PropertyName', 'value': 'PropertyValue'}],
                    'sponsor_name': 'SponsorName',
                    'project_name': 'ProjectName',
                    'date': '2020-05-20',
                }
            }]
        };

        const results = await temporalSearch(geometry, undefined, undefined, undefined, undefined, undefined, undefined);
        await expect(results).toEqual(expect.objectContaining(expectedGeoJson));
    });


});

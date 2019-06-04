import { markerFromAsset } from '../utils';

describe('markerFromAsset', () => {
    let mockMarker;

    beforeEach(() => {
        mockMarker = jest.fn();

        global.L = {
            marker: mockMarker,
            latLng: jest.fn()
        };
    });

    it('should construct a marker', () => {
        markerFromAsset({ latitude: 2, longitude: 5 });
        expect(mockMarker).toHaveBeenCalledTimes(1);
    });
});

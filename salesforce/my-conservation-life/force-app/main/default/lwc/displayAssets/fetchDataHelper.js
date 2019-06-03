const recordMetadata = {
    assetID: 'assetID',
    assetType: 'type',
    location: 'loc',
    plantDate: 'plantDate',
    phone: 'phoneNumber',
    closeAt: 'dateInFuture',
};

export default function fetchDataHelper({ amountOfRecords }) {
    return fetch('https://my-conservation-life.herokuapp.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            amountOfRecords,
            recordMetadata,
        }),
    }).then(response => response.json());
}

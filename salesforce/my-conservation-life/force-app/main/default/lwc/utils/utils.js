import { URL } from './connection';

const handleFetchErrors = (response) => {
    if (!response.ok) {
        throw response.statusText;
    }

    return response.json();
};

const get = (url) => {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(handleFetchErrors);
};

const post = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(handleFetchErrors);
};

const putCSV = (url, assetTypeId, csvFile) => {
    // Key-value pairs that represent form fields and corresponding values
    const formData = new FormData();
    formData.append('assetTypeId', assetTypeId);
    formData.append('csv', csvFile);

    return fetch(url, {
        method: 'PUT',
        body: formData
    }).then(handleFetchErrors);
};

export default {
    URL,
    get,
    post,
    putCSV
};

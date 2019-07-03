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

export default {
    URL,
    get,
    post
};
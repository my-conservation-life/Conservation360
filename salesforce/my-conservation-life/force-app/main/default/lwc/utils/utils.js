//rename and split functionality

function handleFetchErrors(response) {
    if (!response.ok) {
        throw response.statusText;
    }

    return response.json();
}

export const api = {
    "URL": "https://my-conservation-life.herokuapp.com/",
    "get": url => {
        return fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(handleFetchErrors);
    },
    "post": (url, data) => {
        return fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(handleFetchErrors);
    }
}
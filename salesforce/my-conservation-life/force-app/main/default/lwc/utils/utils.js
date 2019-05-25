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
    }
}
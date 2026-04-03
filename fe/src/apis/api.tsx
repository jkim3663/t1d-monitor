// base path to call FHIR APIs

const basePath: string = import.meta.env.APP_SERVER_URL + 'fhir/';

const api = {
    get: (endpoint: string) => {
        return fetch(`${basePath}/${endpoint}`, {
            method: 'GET'
        });
    },
    post: (endpoint: string, body: object) => {
        return fetch(`${basePath}/${endpoint}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: body && JSON.stringify(body)
        });
    },
    put: (endpoint: string, body: object) => {
        return fetch(`${basePath}/${endpoint}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: body && JSON.stringify(body)
        });
    },
    patch: (endpoint: string, body: object) => {
        return fetch(`${basePath}/${endpoint}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json'
            },
            body: body && JSON.stringify(body)
        });
    },
    delete: (endpoint: string) => {
        return fetch(`${basePath}/${endpoint}`, {
            method: 'DELETE'
        });
    }
};

export { api };
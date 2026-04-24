// base path to call FHIR APIs

const basePath: string = `${import.meta.env.VITE_APP_SERVER_URL}` + '/api/fhir';
const goAppBasePath: string = `${import.meta.env.VITE_APP_SERVER_URL}`;

const api = {
    get: (endpoint: string) => {
        return fetch(`${basePath}/${endpoint}`, {
            method: 'GET',
            credentials: 'include',
        });
    },
    post: (endpoint: string, body: object) => {
        return fetch(`${basePath}/${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: body && JSON.stringify(body)
        });
    },
    put: (endpoint: string, body: object) => {
        return fetch(`${basePath}/${endpoint}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: body && JSON.stringify(body)
        });
    },
    patch: (endpoint: string, body: object) => {
        return fetch(`${basePath}/${endpoint}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: body && JSON.stringify(body)
        });
    },
    delete: (endpoint: string) => {
        return fetch(`${basePath}/${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
        });
    }
};

const goAppApi = {
    get: (endpoint: string) => {
        return fetch(`${goAppBasePath}/${endpoint}`, {
            method: 'GET',
            credentials: 'include',
        });
    },
    post: (endpoint: string, body: object) => {
        return fetch(`${goAppBasePath}/${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: body && JSON.stringify(body)
        });
    },
}

export { api, goAppApi };
import type { LoginRequestModel } from '../models/login-request-model';
import { goAppApi } from './api';

export async function getSession() {
    const resp = await goAppApi.get('session')
    let data = null;
    try {
        data = await resp.json()
    } catch (e) {
    
    }
    return {
        statusCode: resp.status
    }
}

export async function postRegistration(requestBody: LoginRequestModel) {
    const resp = await goAppApi.post('register', requestBody);
    const respData = await resp.text()
    return {
        status: resp.status,
        data: respData ?? null,
    }
}

export async function postLogin(requestBody: LoginRequestModel) {
    const resp = await goAppApi.post('login', requestBody);
    const respData = await resp.text()
    return {
        status: resp.status,
        data: respData ?? null,
    }
}
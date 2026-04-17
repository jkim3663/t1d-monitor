import type { LoginRequestModel } from '../models/login-request-model';
import { goAppApi } from './api';

export async function getSession() {
    const resp = await goAppApi.get('session')
    let data = null;
    try {
        data = resp.json()
    } catch (e) {
    
    }
    return {
        statusCode: resp.status
    }
}

export async function postRegistration(requestBody: LoginRequestModel) {
    const resp = await goAppApi.post('register', requestBody);
    return {
        status: resp.status,
        data: resp.json()
    }
}

export async function postLogin(requestBody: LoginRequestModel) {
    const resp = await goAppApi.post('login', requestBody);
    return {
        status: resp.status,
        data: resp.json()
    }
}
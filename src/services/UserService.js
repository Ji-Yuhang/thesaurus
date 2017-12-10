import request from '../utils/request';
import { PAGE_SIZE } from '../constants';
import * as api from '../utils/api';
export async function login(params) {
    return api.post(`/api/admin/v1/users/sign_in`,params);
}
export async function refreshUser() {
    return api.get(`/api/v1/users/current`);
}

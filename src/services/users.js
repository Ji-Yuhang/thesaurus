import request from '../utils/request';
import { PAGE_SIZE } from '../constants';
export function fetch({ page }) {
  // return request(`/api/users?_page=${page}&_limit=${PAGE_SIZE}`);
  return request(`/api/v1/phone_categories/tree/0`);
}

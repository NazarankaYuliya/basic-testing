import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((func: void) => func),
}));
const URL = 'https://jsonplaceholder.typicode.com';
const response = { data: 'data' };
const path = '/posts';

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockResolvedValue(response);
    jest.spyOn(axios, 'create').mockReturnThis();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(path);
    expect(jest.spyOn(axios, 'create')).lastCalledWith({ baseURL: URL });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(path);
    expect(axios.get).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    const res = await throttledGetDataFromApi(path);
    expect(res).toEqual(response.data);
  });
});

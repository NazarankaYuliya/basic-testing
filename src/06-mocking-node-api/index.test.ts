import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const time = 1000;
    const callback = jest.fn();
    doStuffByTimeout(callback, time);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), time);
  });

  test('should call callback only after timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 1000;
    doStuffByTimeout(callback, timeout);
    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 1000;
    doStuffByInterval(callback, interval);
    jest.advanceTimersByTime(interval);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 1000;
    const numIntervals = 3;
    doStuffByInterval(callback, interval);
    jest.advanceTimersByTime(interval * numIntervals);
    expect(callback).toHaveBeenCalledTimes(numIntervals);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'file.txt';
    jest.spyOn(path, 'join');
    readFileAsynchronously(pathToFile);
    expect(path.join).toHaveBeenCalledTimes(1);
    expect(path.join).toHaveBeenCalledWith(expect.anything(), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'file.txt';
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const res = await readFileAsynchronously(pathToFile);
    expect(res).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'file.txt';
    const mockText = 'Mock Text';
    jest.mock('fs');
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.mock('fs/promises');
    jest.spyOn(fsPromises, 'readFile').mockResolvedValue(mockText);
    const res = await readFileAsynchronously(pathToFile);
    expect(res).toBe(mockText);
  });
});

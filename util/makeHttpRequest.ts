import { IncomingMessage, RequestOptions } from 'http';
import { ResultAsync } from 'neverthrow';
import { request } from 'https';

type HttpOptions = RequestOptions & { data?: string; };

enum Methods {
  DELETE = 'DELETE',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

function tryParse(str: string): any {
  try {
    const json = JSON.parse(str);
    return json;
  } catch (err) {
    return str;
  }
}

export function checkIsConfigValid(config: HttpOptions): boolean {
  return (
    !!Object.values(Methods).includes(config.method as Methods) &&
    !!config.hostname &&
    !!config.path
  );
}

export function checkIsBadStatus(statusCode: number | undefined) {
  return Number(statusCode) >= 400;
}

interface HttpError extends Error {
  originalError: Error;
}

export function makeHttpError(err: Error | unknown) {
  const httpError = new Error(`http error`) as HttpError;
  if (err instanceof Error) {
    httpError.message += `: ${err.message}`;
    httpError.originalError = err;
  }
  return httpError;
}

export default function makeHttpRequest(
  config: HttpOptions
): ResultAsync<any, HttpError> {
  const httpPromise = new Promise((resolve, reject) => {
    if (!checkIsConfigValid(config)) {
      return reject(new Error('Bad Config'));
    }

    let responseData = '';
    const httpRequest = request(config, (response: IncomingMessage) => {
      if (checkIsBadStatus(response.statusCode)) {
        return reject(new Error('Bad Status'));
      }

      response.on('data', (chunk) => {
        responseData += chunk;
      });

      response.on('end', () => {
        return resolve(tryParse(responseData));
      });
    });
    httpRequest.write(config.data ? config.data : '');
    httpRequest.on('error', (err) => {
      return reject(err);
    });
    httpRequest.end();
  });
  return ResultAsync.fromPromise(httpPromise, (err) => makeHttpError(err));
}

import { err, ok } from 'neverthrow';
import { HttpMethods } from '../types/http';
import makeHttpRequest from '../util/makeHttpRequest';

const hostname = 'randomuser.me';
const path = '/api/?results=50';

export async function getUsers() {
  const users = await makeHttpRequest({
    hostname,
    path,
    method: HttpMethods.GET,
  });

  if (users.isErr()) {
    return err(users.error);
  }
  return ok(users.value);
}

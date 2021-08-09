import { APIGatewayProxyEvent } from 'aws-lambda';
import { getUsers } from '../../services/usersService';

interface Auth {
  id: string;
}

export default async function getUsersLambda(event: APIGatewayProxyEvent) {
  const { id } = event.requestContext.authorizer as Auth;
  const usersResponse = await getUsers();
  return usersResponse
    .map((users) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ users, idFromAuthorizer: id }),
      };
    })
    .mapErr((e) => {
      return { statusCode: 500, body: JSON.stringify(e) };
    });
}

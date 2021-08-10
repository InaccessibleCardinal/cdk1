import { APIGatewayProxyEvent } from 'aws-lambda';
import { getUsers } from '../../services/usersService';

export default async function handler(event: APIGatewayProxyEvent) {
  const usersResponse = await getUsers();
  if (usersResponse.isErr()) {
    return {
      statusCode: 500,
      body: JSON.stringify(usersResponse.error),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      users: usersResponse.value,
      ctxFromAuthorizer: event.requestContext.authorizer,
    }),
  };
}

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export default async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.info('event: ', event);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello lambda', event }),
  };
}

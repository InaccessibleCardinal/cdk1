import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';

type AuthorizerResponse = Promise<APIGatewayAuthorizerResult | string | Error>;

export default async function handler(
  event: APIGatewayTokenAuthorizerEvent
): AuthorizerResponse {
  const { authorizationToken, methodArn } = event;

  switch (authorizationToken) {
    case 'Bearer good':
      return generatePolicy('Allow', methodArn, { id: 'abc' });
    case 'Bearer bad':
      return generatePolicy('Deny', methodArn, {});
    case 'unauthorized':
      return 'Unauthorized';
    default:
      return new Error('Error: Invalid token');
  }
}

function generatePolicy(
  effect: 'Allow' | 'Deny',
  arn: string,
  context: any
): APIGatewayAuthorizerResult {
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: arn,
        },
      ],
    },
    context,
  };
}

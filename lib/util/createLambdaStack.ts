import { Construct, NestedStack } from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { LambdaIntegration, Method, RestApi } from '@aws-cdk/aws-apigateway';
import { EndpointStackProps } from '../../types/props';

type LambdaStackConfig = {
  apiName: string;
  codePath: string;
  endpoint: string;
  httpMethods: string[];
  lambdaName: string;
  stackName: string;
};

export default function createLambdaStack({
  apiName,
  codePath,
  endpoint,
  httpMethods,
  lambdaName,
  stackName,
}: LambdaStackConfig) {
  class LambdaStack extends NestedStack {
    public readonly methods: Method[] = [];

    constructor(scope: Construct, props: EndpointStackProps) {
      super(scope, stackName, props);
      const api = RestApi.fromRestApiAttributes(this, apiName, {
        restApiId: props.restApiId,
        rootResourceId: props.rootResourceId,
      });
      const usersLambda = new lambda.Function(this, lambdaName, {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(codePath),
        handler: 'index.default',
      });
      const usersIntegration = new LambdaIntegration(usersLambda);
      const resource = api.root.addResource(endpoint);
      httpMethods.forEach((method) => {
        const gwMethod = resource.addMethod(method, usersIntegration);
        this.methods.push(gwMethod);
      });
    }
  }

  return LambdaStack;
}

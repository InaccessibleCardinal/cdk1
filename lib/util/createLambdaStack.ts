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
  propsArg: EndpointStackProps;
  scopeArg: Construct;
  stackName: string;
};

export default function createLambdaStack({
  apiName,
  codePath,
  endpoint,
  httpMethods,
  lambdaName,
  propsArg,
  scopeArg,
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
      const thisLambda = new lambda.Function(this, lambdaName, {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(codePath),
        handler: 'index.default',
      });
      const thisIntegration = new LambdaIntegration(thisLambda);
      const resource = api.root.addResource(endpoint);
      httpMethods.forEach((method) => {
        const gwMethod = resource.addMethod(method, thisIntegration);
        this.methods.push(gwMethod);
      });
    }
  }

  return new LambdaStack(scopeArg, propsArg);
}

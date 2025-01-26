import { AmplifyApiGraphQlResourceStackTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiGraphQlResourceStackTemplate) {
  resources.restApi.addDependsOn({
    category: 'function',
    resourceName: 'franco-game-handler',
    attributes: ['Name', 'Arn']
  });
}

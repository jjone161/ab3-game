export const amplifyConfig = {
    Auth: {
        region: 'us-east-1', // replace with your region
        userPoolId: 'us-east-1_P1wxOgjjl', // get this from Cognito
        userPoolWebClientId: '4bhchdmprd5h9jgivdsi366ks6', // get this from Cognito
        authenticationFlowType: 'USER_SRP_AUTH'
    }
};


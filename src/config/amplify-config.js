const amplifyConfig = {
    Auth: {
        region: 'us-east-1', // your region
        userPoolId: 'us-east-1_OjSZIiDXs', // your user pool ID
        userPoolWebClientId: '7o0sso21vhh0nic2q85lfuajfq', // your app client ID
        oauth: {
            domain: 'https://franco-game.auth.us-east-1.amazoncognito.com',
            scope: ['email', 'openid'],
            redirectSignIn: 'https://main.d2dltd1m02972k.amplifyapp.com/',
            redirectSignOut: 'https://main.d2dltd1m02972k.amplifyapp.com/',
            responseType: 'code'
        }
    }
};

export default amplifyConfig;

import { Amplify } from 'aws-amplify';

const config = {
    API: {
        endpoints: [
            {
                name: "francoGameApi",
                endpoint: "https://l0tebdk8th.execute-api.us-east-1.amazonaws.com"
            }
        ]
    }
};

Amplify.configure(config);

export default config;

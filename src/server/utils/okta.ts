import OktaJwtVerifier from '@okta/jwt-verifier';
import okta from '@okta/okta-sdk-nodejs';

export const verifierOptions = {
    clientId: process.env.OKTA_CLIENT_ID,
    issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
};
export const oktaJwtVerifier = new OktaJwtVerifier(verifierOptions);

export const oktaClient = new okta.Client({
    orgUrl: process.env.OKTA_ORG_URL,
    token: process.env.OKTA_TOKEN,
});


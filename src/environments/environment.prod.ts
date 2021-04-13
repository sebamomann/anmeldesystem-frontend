/* tslint:disable */
export const environment = {
  production: true,
  API_URL: window['env']['API_URL'],
  BASE_URL: window['env']['BASE_URL'],
  VAPID_KEY: window['env']['VAPID_KEY'],
  keycloak: {
    url: window['env']['KEYCLOAK_URL'],
    realm: window['env']['KEYCLOAK_REALM'],
    redirectUri: window['env']['KEYCLOAK_REDIRECT_URI'],
    postLogoutRedirectUri: window['env']['KEYCLOAK_POST_LOGOUT_REDIRECT_URI'],
    clientId: window['env']['KEYCLOAK_CLIENT_ID'],
    responseType: window['env']['KEYCLOAK_RESPONSE_TYPE'],
    scope: window['env']['KEYCLOAK_SCOPE'],
    requireHttps: true,
    showDebugInformation: false,
    disableAtHashCheck: true
  }
};

(function (window) {
  window["env"] = window["env"] || {};

  window["env"]["production"] = true;

  // window["env"]["API_URL"] = "http://localhost:3000/";
  window["env"]["API_URL"] = 'https://35d5e98a-8202-4b10-8e4c-328978662b1d.mock.pstmn.io/';
  window["env"]["BASE_URL"] = "http://localhost:4200/";

  window["env"]["VAPID_KEY"] = 'BMqkFS2ITWunnQCLC8nmJVdhSeJDmw1paOe7XK99dHsSxsCqPp-s1AnQm8ByltY1JFEtW2eZqac6PaXB103Ov2k';

  window['env']['KEYCLOAK_URL'] = 'https://account.sebamomann.de/auth/';
  window['env']['KEYCLOAK_REALM'] = 'test';
  window['env']['KEYCLOAK_REDIRECT_URI'] = 'https://localhost:4200/';
  window['env']['KEYCLOAK_POST_LOGOUT_REDIRECT_URI'] = 'https://localhost:4200/';
  window['env']['KEYCLOAK_CLIENT_ID'] = 'test';
  window['env']['KEYCLOAK_RESPONSE_TYPE'] = 'code';
  window['env']['KEYCLOAK_SCOPE'] = 'openid profile email';
})(this);

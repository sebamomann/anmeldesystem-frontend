(function (window) {
  window.env = window.env || {};

  window["env"]["production"] = "${PRODUCTION}"

  window['env']['API_URL'] = "${API_URL}";
  window['env']['BASE_URL'] = "${BASE_URL}";

  window['env']['VAPID_KEY'] = "${VAPID_PUBLIC_KEY}";

  window['env']['KEYCLOAK_URL'] = "${KEYCLOAK_URL}";
  window['env']['KEYCLOAK_REALM'] = "${KEYCLOAK_REALM}";
  window['env']['KEYCLOAK_REDIRECT_URI'] = "${KEYCLOAK_REDIRECT_URI}";
  window['env']['KEYCLOAK_POST_LOGOUT_REDIRECT_URI'] = "${KEYCLOAK_POST_LOGOUT_REDIRECT_URI}";
  window['env']['KEYCLOAK_CLIENT_ID'] = "${KEYCLOAK_CLIENT_ID}";
  window['env']['KEYCLOAK_RESPONSE_TYPE'] = "${KEYCLOAK_RESPONSE_TYPE}";
  window['env']['KEYCLOAK_SCOPE'] = "${KEYCLOAK_SCOPE}";
})(this);

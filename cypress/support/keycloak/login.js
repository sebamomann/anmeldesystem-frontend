import jwt_decode from 'jwt-decode';

Cypress.Commands.add('keycloack_login_via_api', (username, password) => {
  const keycloak_server = Cypress.env('KEYCLOAK_URL');
  const keycloak_realm = Cypress.env('KEYCLOAK_REALM');
  const grant_type = 'password';
  const client_id = Cypress.env('KEYCLOAK_CLIENT_ID');
  const client_secret = '';

  const url = `${keycloak_server}realms/${keycloak_realm}/protocol/openid-connect/token`;

  cy.request(
    {
      method: 'POST',
      url,
      form: true,
      body: {
        client_id: client_id,
        username: username,
        password: password,
        client_secret: client_secret,
        grant_type: grant_type,
        scope: "openid"
      },
    }
  ).then(
    ({ body }) => {
      const id_token = body.id_token;
      const access_token = body.access_token;
      const id_token_claims_obj = jwt_decode(id_token);

      window.localStorage.setItem('access_token', JSON.stringify(access_token));
      window.localStorage.setItem('id_token', JSON.stringify(id_token));
      window.localStorage.setItem('id_token_claims_obj', JSON.stringify(id_token_claims_obj));
    }
  );
});

Cypress.Commands.add('keycloack_login_via_ui', (username, password) => {
  cy.get("#username")
    .type(username);
  cy.get("#password")
    .type(password);
  cy.get("[type=submit]")
    .click();
});

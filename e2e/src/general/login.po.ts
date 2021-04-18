import {IUserDataProviderModel} from '../IUserDataProviderModel';
import {HttpClient} from 'protractor-http-client';
import {EnvironmentPage} from './environment.po';
import {LocalStoragePage} from './localStorage.po';
import {browser} from 'protractor';

export class LoginPage {
  constructor() {
  }

  async loginViaApi(user: IUserDataProviderModel) {
    const environmentPage = new EnvironmentPage();
    const localStoragePage = new LocalStoragePage();

    console.log(await browser.executeScript('return window.env.KEYCLOAK_URL;'));

    const server = await environmentPage.getEnvironmentVariable('keycloak_url');
    const realm = await environmentPage.getEnvironmentVariable('keycloak_realm');
    const grantType = 'password';
    const clientId: string = await environmentPage.getEnvironmentVariable('keycloak_client_id');
    const clientSecret = '';

    const url = `realms/${realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams();
    body.set('client_id', clientId);
    body.set('username', user.username);
    body.set('password', user.password);
    body.set('client_secret', clientSecret);
    body.set('grant_type', grantType);
    body.set('scope', 'openid');

    const http = new HttpClient(server);

    const res = await http.post(url,
      body.toString(),
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    );

    await localStoragePage.set('access_token', res.access_token);
    await localStoragePage.set('id_token', res.id_token);
  }
}

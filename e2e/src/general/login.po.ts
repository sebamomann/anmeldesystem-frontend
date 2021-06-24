import {IUserDataProviderModel} from '../IUserDataProviderModel';
import {HttpClient} from 'protractor-http-client';
import {EnvironmentPage} from './environment.po';
import {LocalStoragePage} from './localStorage.po';

export class LoginPage {
  private environmentPage = new EnvironmentPage();

  constructor() {
  }

  async loginViaApi(user: IUserDataProviderModel) {
    const localStoragePage = new LocalStoragePage();

    const server = await this.environmentPage.getEnvironmentVariable('keycloak_url');
    const realm = await this.environmentPage.getEnvironmentVariable('keycloak_realm');
    const grantType = 'password';
    const clientId: string = await this.environmentPage.getEnvironmentVariable('keycloak_client_id');
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

    let res = await http.post(url,
      body.toString(),
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    );

    res = JSON.parse(res.body);

    await localStoragePage.setString('access_token', res.access_token);
    await localStoragePage.setString('id_token', res.id_token);
  }

  async getURLOfLogin() {
    const url = await this.environmentPage.getEnvironmentVariable('keycloak_url');
    const realm = await this.environmentPage.getEnvironmentVariable('keycloak_realm');

    return `${url}realms/${realm}/protocol/openid-connect/auth`;
  }
}

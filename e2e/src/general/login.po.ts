import jwt_decode from 'jwt-decode';
import { IUserDataProviderModel } from '../IUserDataProviderModel';
import { HttpClient } from 'protractor-http-client';
import { EnvironmentPage } from './environment.po';
import { LocalStoragePage } from './localStorage.po';
import { browser, by, element, protractor } from 'protractor';

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

    const id_token_claims_obj = jwt_decode(res.id_token);

    await localStoragePage.setString('access_token', res.access_token);
    await localStoragePage.setString('id_token', res.id_token);
    await localStoragePage.set('id_token_claims_obj', id_token_claims_obj);
  }

  async loginViaUI(user: IUserDataProviderModel) {
    await this.setUsername(user.username);
    await this.setPassword(user.password);

    this.getSubmit().click();
  }

  public setUsername(value: string) {
    const ref = this.getUsername();
    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public setPassword(value: string) {
    const ref = this.getPassword();
    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public getUsername() {
    return element(by.id('username'));
  }

  public getPassword() {
    return element(by.id('password'));
  }

  public getSubmit() {
    return element(by.name('login'));
  }

  async getURLOfLogin() {
    const url = await this.environmentPage.getEnvironmentVariable('keycloak_url');
    const realm = await this.environmentPage.getEnvironmentVariable('keycloak_realm');

    return `${url}realms/${realm}/protocol/openid-connect/auth`;
  }

  public waitForFormBuild() {
    const EC = protractor.ExpectedConditions;
    const e = this.getUsername();

    return browser.wait(EC.presenceOf(e), 10000, 'Form could not be loaded');
  }

  async logout() {
    const localStoragePage = new LocalStoragePage();

    const server = await this.environmentPage.getEnvironmentVariable('keycloak_url');
    const realm = await this.environmentPage.getEnvironmentVariable('keycloak_realm');
    const clientId: string = await this.environmentPage.getEnvironmentVariable('keycloak_client_id');
    const refreshToken: string = await localStoragePage.getString('refresh_token');

    const url = `realms/${realm}/protocol/openid-connect/logout`;

    const body = new URLSearchParams();
    body.set('client_id', clientId);
    body.set('refresh_token', refreshToken);

    const http = new HttpClient(server);

    await http.post(url,
      body.toString(),
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    );
  }
}

import {browser, protractor} from 'protractor';
import {LoginPage} from './login.po';

describe('Login Page', () => {
  const user = {
    username: 'user_login',
    mail: 'user_login@example.com',
    password: '123',
  };
  let page = new LoginPage();

  beforeEach(async () => {
    page = new LoginPage();
    browser.ignoreSynchronization = true;

    // USER MANAGEMENT
    await page.logout();
    await page.navigateTo();
  });

  it('Should display form with title "Login"', async () => {
    expect(await page.getMatCardTitle()).toEqual('Login');
  });

  describe('Login', () => {
    it('with username - success', async () => {
      await page.setUsername(user.username);
      await page.setPassword(user.password);

      page.submit();

      expect(
        browser.wait(protractor.ExpectedConditions.urlContains('/dashboard'), 5000)
          .catch(() => {
            return false;
          })
      ).toBeTruthy(`Url match could not succeed`);
      expect(await page.getSnackbar().getText()).toEqual('Erfolgreich eingeloggt\nOK');
    });

    it('with mail - success', async () => {
      await page.setUsername(user.mail);
      await page.setPassword(user.password);

      page.submit();

      expect(
        browser.wait(protractor.ExpectedConditions.urlContains('/dashboard'), 5000)
          .catch(() => {
            return false;
          })
      ).toBeTruthy(`Url match could not succeed`);
      expect(await page.getSnackbar().getText()).toEqual('Erfolgreich eingeloggt\nOK');
    });

    describe('invalid', () => {
      it('invalid username', async () => {
        await page.setUsername('invalid_username');
        await page.setPassword(user.password);

        page.submit();

        expect(await page.getLoginError().getText()).toEqual('Benutzername oder Passwort falsch');
      });

      it('invalid password', async () => {
        await page.setUsername(user.username);
        await page.setPassword('invalid password');

        page.submit();

        expect(await page.getLoginError().getText()).toEqual('Benutzername oder Passwort falsch');
      });
    });
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    // const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    // expect(logs).not.toContain(jasmine.objectContaining({
    //   level: logging.Level.SEVERE,
    // } as logging.Entry));
  });
});

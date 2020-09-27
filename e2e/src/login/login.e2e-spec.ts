import {browser, protractor} from 'protractor';
import {LoginPage} from './login.po';

beforeAll(async () => {
  await browser.get('/');
});

describe('Login Page', () => {
  const user = {
    username: 'user_login',
    mail: 'user_login@example.com',
    password: '123',
  };

  const user_lock = {
    username: 'user_login_lock',
    mail: 'user_login_lock@example.com',
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
    describe('success', () => {
      it('with username', async () => {
        await page.setUsername(user.username);
        page.next();

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

      it('with mail', async () => {
        await page.setUsername(user.mail);

        page.next();

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
    });

    describe('invalid', () => {
      it('invalid username', async () => {
        await page.setUsername('invalid_username');

        page.next();

        await page.setPassword(user.password);

        page.submit();

        await expect((await page.getLoginError()).getText()).toEqual('Benutzername oder Passwort falsch');
      });

      it('invalid password', async () => {
        await page.setUsername(user.username);

        page.next();

        await page.setPassword('invalid password');

        page.submit();

        await expect((await page.getLoginError()).getText()).toEqual('Benutzername oder Passwort falsch');
      });

      it('password changed', async () => {
        await page.setUsername(user.username);

        page.next();

        await page.setPassword('oldPassword');

        page.submit();

        await expect((await page.getLoginError()).getText()).toEqual('Du hast dieses Passwort am 18.11.2020, 12:23Uhr geändert');
      });

      it('not activated', async () => {
        await page.setUsername(user_lock.username);

        page.next();

        await page.setPassword(user_lock.password);

        page.submit();

        expect(await page.accountActivationDialogExists()).toBeTruthy();
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

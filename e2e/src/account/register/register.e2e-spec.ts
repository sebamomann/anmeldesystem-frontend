import {browser} from 'protractor';
import {RegisterPage} from './register.po';

beforeAll(async () => {
  await browser.get('/');
});

describe('Register Page', () => {
  let page = new RegisterPage();

  beforeEach(async () => {
    page = new RegisterPage();
    browser.ignoreSynchronization = true;

    // USER MANAGEMENT
    await page.logout();
    await page.navigateTo();
  });

  it('Should display form with title "Registrieren"', async () => {
    expect(await page.getMatCardTitle()).toEqual('Registrieren');
  });

  describe('Register', () => {
    describe('fill form', () => {
      beforeEach(() => {
        page.setUsername('user_register');
        page.setName('User Register');
        page.setMail('user_register@example.com');
        page.setPassword('123');
        page.setPasswordVerify('123');
      });

      describe('send', () => {
        beforeEach(() => {
          page.submit();
        });

        it('should complete registration', () => {
          page.registrationDoneExists();
        });
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

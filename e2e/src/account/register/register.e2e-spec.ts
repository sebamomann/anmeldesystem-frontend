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

      describe('invalid values', () => {
        describe('username', () => {
          describe('invalid', () => {
            beforeEach(() => {
              page.setUsername('_user_register');
            });

            describe('send', () => {
              beforeEach(() => {
                page.submit();
              });

              it('should show error message', async () => {
                await expect((await page.getUsernameError()).getText()).toEqual('Invalides Format (i)');
                expect(page.usernameErrorAdditionExists()).toBeTruthy();
              });
            });
          });
          describe('missing', () => {
            beforeEach(() => {
              page.clearUsername();
            });

            describe('send', () => {
              beforeEach(() => {
                page.submit();
              });

              it('should show error message', async () => {
                await expect((await page.getUsernameError()).getText()).toEqual('Erforderlich');
                expect(page.usernameErrorAdditionExists()).toBeFalsy();
              });
            });
          });
        });

        describe('name', () => {
          describe('invalid', () => {
            beforeEach(() => {
              page.setName('User_Register');
            });

            describe('send', () => {
              beforeEach(() => {
                page.submit();
              });

              it('should show error message', async () => {
                await expect((await page.getNameError()).getText()).toEqual('Invalides Format (i)');
              });
            });
          });
          describe('missing', () => {
            beforeEach(() => {
              page.clearName();
            });

            describe('send', () => {
              beforeEach(() => {
                page.submit();
              });

              it('should show error message', async () => {
                await expect((await page.getNameError()).getText()).toEqual('Erforderlich');
              });
            });
          });
        });

        describe('mail', () => {
          describe('invalid', () => {
            beforeEach(() => {
              page.setMail('mail');
            });

            describe('send', () => {
              beforeEach(() => {
                page.submit();
              });

              it('should show error message', async () => {
                await expect((await page.getMailError()).getText()).toEqual('Diese Email-Adresse hat kein gültiges Format');
              });
            });
          });
          describe('missing', () => {
            beforeEach(() => {
              page.clearMail();
            });

            describe('send', () => {
              beforeEach(() => {
                page.submit();
              });

              it('should show error message', async () => {
                await expect((await page.getMailError()).getText()).toEqual('Erforderlich');
              });
            });
          });
        });

        describe('password', () => {
          describe('mismatch', () => {
            beforeEach(() => {
              page.setPasswordVerify('1234');
            });

            describe('send', () => {
              beforeEach(() => {
                page.submit();
              });

              it('should show error message', async () => {
                await expect((await page.getPasswordVerifyError()).getText()).toEqual('Die Passwörter stimmen nicht überein');
              });
            });
          });

          describe('missing', () => {
            describe('password', () => {
              beforeEach(() => {
                page.clearPassword();
                page.clearPasswordVerify();
              });

              describe('send', () => {
                beforeEach(() => {
                  page.submit();
                });

                it('should show error message', async () => {
                  await expect((await page.getPasswordError()).getText()).toEqual('Erforderlich');
                });
              });
            });

            describe('passwordVerify', () => {
              beforeEach(() => {
                page.clearPassword();
                page.clearPasswordVerify();
              });

              describe('send', () => {
                beforeEach(() => {
                  page.submit();
                });

                it('should show error message', async () => {
                  await expect((await page.getPasswordVerifyError()).getText()).toEqual('Erforderlich');
                });
              });
            });
          });
        });
      });

      describe('send', () => {
        beforeEach(() => {
          page.submit();
        });

        it('should complete registration', () => {
          expect(page.registrationDoneExists()).toBeTruthy();
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

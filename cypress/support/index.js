// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import './util/local-storage';
import './util/navigation';
import './appointment/overview';
import './appointment/appointment-data';
import './appointment/enrollment-list';
import './enrollment/create';
import './enrollment/edit';
import './enrollment/form/main_form';
import './enrollment/form/additions_form';
import './enrollment/form/driver_and_passenger';
import './enrollment/form/check_form';
import './enrollment/form/login_and_mail_form';
import './keycloak/login';

// Alternatively you can use CommonJS syntax:
// require('./commands')

/* tslint:disable */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: window['env']['API_URL'] || 'http://localhost:3000/',
  BASE_URL: window['env']['BASE_URL'] || 'http://localhost:4200/',
  VAPID_KEY: window['env']['VAPID_KEY'] || 'BMqkFS2ITWunnQCLC8nmJVdhSeJDmw1paOe7XK99dHsSxsCqPp-s1AnQm8ByltY1JFEtW2eZqac6PaXB103Ov2k'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

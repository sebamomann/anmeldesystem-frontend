export const environment = {
  production: true,
  API_URL: window['env']['API_URL'] || 'http://localhost:3000/',
  BASE_URL: window['env']['BASE_URL'] || 'http://localhost:4200/',
  VAPID_KEY: window['env']['VAPID_KEY'] || 'BKEcHfrBBEI416Dl0rJa-f5ctf_jvZ9zbBSzkGMKwpH7P4a62_ScOPjzbAE11zIsrBmVNOJ-CuX6fR7PtrkpAZM'
};

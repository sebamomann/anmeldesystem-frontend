(function (window) {
  window.env = window.env || {};

  // Environment variables
  window['env']['API_URL'] = "${API_URL}";
  window['env']['BASE_URL'] = "${BASE_URL}";
  window['env']['VAPID_KEY'] = "${VAPID_PUBLIC_KEY}";
})(this);

(function (window) {
  window.env = window.env || {};

  // Environment variables
  window['env']['API_URL'] = "${API_URL}";
  window['env']['VAPID_PUBLIC_KEY'] = "${VAPID_PUBLIC_KEY}";
})(this);

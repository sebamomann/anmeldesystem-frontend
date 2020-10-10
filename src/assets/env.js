(function (window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["production"] = true;
  window["env"]["API_URL"] = "http://localhost:3000/";
  window["env"]["VAPID_KEY"] = "key";
})(this);

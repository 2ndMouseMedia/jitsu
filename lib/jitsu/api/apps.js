/*
 * app.js: Client for the Nodejitsu apps API.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var util = require('util'),
    winston = require('winston'),
    jitsu = require('jitsu');

//
// ### function Apps (options)
// #### @options {Object} Options for this instance
// Constructor function for the Apps resource responsible
// with Nodejitsu's Apps API
//
var Apps = exports.Apps = function (options) {
  jitsu.api.Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Apps, jitsu.api.Client);

//
// ### function list (callback)
// #### @callback {function} Continuation to pass control to when complete
// Lists all applications for the authenticated user
//
Apps.prototype.list = function (callback) {
  winston.info('Listing apps');
  this._request('GET', ['apps', jitsu.config.username], callback, function (res, result) {
    callback(null, result.apps);
  });
};

//
// ### function create (app, callback)
// #### @app {Object} Package.json manifest for the application.
// #### @callback {function} Continuation to pass control to when complete
// Creates an application with the specified package.json manifest in `app`. 
//
Apps.prototype.create = function (app, callback) {
  this._request('POST', ['apps', jitsu.config.username, app.name], app, callback, function (res, result) {
    callback();
  });
};

//
// ### function update (name, attrs, callback)
// #### @name {string} Name of the application to update
// #### @attrs {Object} Attributes to update for this application.
// #### @callback {function} Continuation to pass control to when complete
// Updates the application with `name` with the specified attributes in `attrs`
//
Apps.prototype.update = function (name, attrs, callback) {
  this._request('PUT', ['apps', name], attrs, callback, function (res, result) {
    
  });
};

//
// ### function destroy (name, callback)
// #### @name {string} Name of the application to destroy
// #### @callback {function} Continuation to pass control to when complete
// Destroys the application with `name` for the authenticated user. 
//
Apps.prototype.destroy = function (name, callback) {
  this._request('DELETE', ['apps', jitsu.config.username, name], callback, function (res, result) {
    callback();
  });
};
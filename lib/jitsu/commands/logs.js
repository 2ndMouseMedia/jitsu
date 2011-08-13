/*
 * logs.js: Commands related to user resources
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var winston = require('winston'),
    jitsu = require('jitsu');

var logs = exports;

logs.usage = [
  'The `jitsu logs` commands allow you to read the logs related to your app.',
  'The default number of lines to show is 10.',
  '',
  'Example usages:',
  'jitsu logs all',
  'jitsu logs all <number of lines to show>',
  'jitsu logs app <app name>',
  'jitsu logs app <app name> <number of lines to show>'
];

//
// ### function all (callback)
// #### @callback {function} Continuation to pass control to when complete.
// Queries the log API and retrieves the logs for all of the user's apps
//
logs.all = function (amount, callback) {
  if (!callback) {
    callback = amount;
    amount = 10;
  }

  jitsu.logs.byUser(amount, function (err, apps) {
    if (err) {
      return callback(err);
    }

    if (apps.length === 0) {
      winston.warn('No logs for ' + jitsu.config.get('username').magenta + ' from timespan');
      return callback();
    }
    
    function sortLength (lname, rname) {
      var llength = apps[lname].data.length,
          rlength = apps[rname].data.length;
          
      if (llength === rlength) {
        return 0;
      }

      return llength > rlength ? 1 : -1;
    }
    
    Object.keys(apps).sort(sortLength).forEach(function (app) {
      putLogs(apps[app], app, amount, true);
    });

    callback();
  });
};

logs.all.usage = [
  'Print the logs from all applications. The default number of',
  'lines to show is 10.',
  'jits logs all <number of lines to show>',
  '',
  'Example usage:',
  'jitsu logs all',
  'jitsu logs all 5'
];

//
// ### function app (appName, callback)
// #### @appName {string} the application to get the logs for
// #### @callback {function} Continuation to pass control to when complete.
// Queries the log API and retrieves the logs for the specified application
//
logs.app = function (appName, amount, callback) {
  if (callback === undefined) {
    callback = amount;
    amount = 10;
  }

  jitsu.logs.byApp(appName, amount, function (err, results) {
    if (err) {
      return callback(err);
    }

    putLogs(results, appName, amount);
    callback();
  });
}

logs.app.usage = [
  'Print the logs from specified application. The default number of',
  'lines to show is 10.',
  'jits logs app <app name> <number of lines to show>',
  '',
  'Example usage:',
  'jitsu logs app test',
  'jitsu logs app test 40'
];

//
// ### function putLogs (results, appName, amount, showApp)
// #### @results {Object} Logs object to output.
// #### @appName {string} App name associated with the log text.
// #### @showApp {boolean} Value indicating if the app name should be output.
// Parses, formats, and outputs the specified `results` to the user.
//
function putLogs (results, appName, amount, showApp) {
  if (results.data.length === 0) {
    return winston.warn('No logs for ' + appName.magenta + ' in specified timespan');
  }
  
  var logged = 0,
      loglength = jitsu.config.get('loglength');
  
  results.data.forEach(function (datum) {
    var parsed = parse(datum.text);
    if (parsed.text) {
      parsed.text.split('\n').forEach(function (line) {
        var prefix = showApp
          ? datum.timestamp.grey + ' ' + parsed.app.magenta + ': '
          : datum.timestamp.grey + ': '
        
        if (line.length > 0 && logged < amount) {
          if (line.length > loglength) {
            line = line.substr(0, loglength - 3) + '...';
          }
          
          winston.data(prefix + line);
          logged += 1;
        }
      });
    }
  });
}

//
// ### function parse (string)
// #### @string {string} string from logs
// It parses the output from the logs into an object
//
function parse (string) {
  var parts = string.split(','),
      parsed = {},
      complex = false,
      groups,
      length;
  
  for (var i = 0; i < parts.length; i++) {
    groups = parts[i].split('=');
    length = groups.length;
    
    if (length > 2 || length === 0 || groups[0] === 'desc') {
      parsed.text = groups.slice(1).join('');
    }
    else {
      parsed[groups[0]] = groups[1];
    }
  }
  
  return parsed;
}
/*
 * help.js: Command related to jitsu help and usage
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */
 
var colors = require('colors'),
    winston = require('winston'),
    jitsu = require('jitsu');
 
var help = exports;

help.usage = [

'          ___  __',
'    /  /  /   /_  /  /',
' __/  /  /   __/ /__/',
'',

  'Flawless deployment of Node.js apps to the cloud',
  'open-source and fully customizable.',
  'https://github.com/nodejitsu/jitsu',
  '',
  'Usage:'.cyan.bold.underline,
  '',
  '  jitsu <resource> <action> <param1> <param2> ...',
  '',
  'Common Commands:'.cyan.bold.underline,
  '',

  'Deploys current path to Nodejitsu'.cyan,
  '',
  '  jitsu deploy',
  '',

  'Creates a new application on Nodejitsu'.cyan,
  '',
  '  jitsu create',
  '',

  'Lists all applications for the current user'.cyan,
  '',
  '  jitsu list',
  '',

  'Additional Commands'.cyan.bold.underline,
  '',
  '  jitsu apps',
  '  jitsu snapshots',
  '  jitsu users',
  '  jitsu conf',
  '  jitsu logout',
  '',
];

//
// ### function show (name, action)
// #### @name {string} Name of the resource to show help for
// #### @action {string} Name of the action on the resource
// Shows the help for the resource with the specified `name`.
// If `action` is supplied, help for `jitsu <name> <action>`
// is shown.
//
help.show = function (name, action) {
  var usage, resource = jitsu.commands.commands[name];

  if (typeof resource !== 'function') {
    if (action && !resource[action]) {
      winston.error('No help for command ' + [name, action].join(' ').magenta);
      return;
    }

    usage = action ? resource[action].usage : resource.usage;

    if (!usage) {
      winston.error('No help for command ' + [name, action].join(' ').magenta);
      return;
    }
  }
  else {
    usage = resource.usage;
  }

  winston.help('');
  usage.forEach(function (line) {
    winston.help(line);
  });
  winston.help('');
};

//
// Setup exports for all relevant resources: 
// `apps`, `snapshots`, `config`.
//
['apps', 'snapshots', 'users', 'config', 'list', 'deploy', 'create'].forEach(function (resource) {
  help[resource] = function (action, callback) {
    if (!callback) {
      callback = action;
      action = null;
    }

    help.show(resource, action);
    callback();
  };
});
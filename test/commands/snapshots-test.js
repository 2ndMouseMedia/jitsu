/*
 * snapshots.js: Tests for `jitsu snapshots *` command(s).
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */
 
var nock = require('nock'),
    vows = require('vows'),
    path = require('path'),
    fs = require('fs'),
    jitsu = require('../../lib/jitsu'),
    macros = require('../helpers/macros');

var shouldNodejitsuOk = macros.shouldNodejitsuOk;

// Snapshots tests with specified app names
vows.describe('jitsu/commands/snapshots').addBatch({
  'snapshots list application': shouldNodejitsuOk(function setup() {
    nock('http://api.mockjitsu.com')
      .get('/apps/tester/application/snapshots')
      .reply(200, {
        snapshots: [{
          id: '0.0.0', 
          ctime: new Date(), 
          md5: 'q34rq43r5t5g4w56t45t'
        }] 
      }, { 'x-powered-by': 'Nodejitsu' });
  })
}).addBatch({
  'snapshots list application2': shouldNodejitsuOk(function setup() {
    nock('http://api.mockjitsu.com')
      .get('/apps/tester/application2/snapshots')
      .reply(200, {
        snapshots: [{
          id: '0.0.0', 
          ctime: new Date(), 
          md5: 'q34rq43r5t5g4w56t45t'
        }] 
      }, { 'x-powered-by': 'Nodejitsu' });
  })
}).addBatch({
  'snapshots activate application2': shouldNodejitsuOk(function setup() {
    jitsu.prompt.override.snapshot = '0.0.0-1';

    nock('http://api.mockjitsu.com')
      .get('/apps/tester/application2/snapshots')
        .reply(200, {
          snapshots: [{
            id: '0.0.0-1', 
            ctime: new Date(), 
            md5: 'q34rq43r5t5g4w56t45t'
          }]
        }, { 'x-powered-by': 'Nodejitsu' })
      .post('/apps/tester/application2/snapshots/0.0.0-1/activate', {})
        .reply(200, '', { 'x-powered-by': 'Nodejitsu' });
  })
}).addBatch({
  'snapshots destroy application3': shouldNodejitsuOk(function setup() {
    jitsu.prompt.override.answer = 'yes';
    jitsu.prompt.override.snapshot = '0.0.0-1';
    jitsu.prompt.override.destroy = 'yes';
    
    nock('http://api.mockjitsu.com')
      .get('/apps/tester/application3/snapshots')
        .reply(200, {
          snapshots: [{
            id: '0.0.0-1', 
            ctime: new Date(), 
            md5: 'q34rq43r5t5g4w56t45t'
          }]
        }, { 'x-powered-by': 'Nodejitsu' })
      .delete('/apps/tester/application3/snapshots/0.0.0-1', {})
        .reply(200, '', { 'x-powered-by': 'Nodejitsu' });
  })
}).addBatch({
  // This tests jitsu's ability to infer the app name.
  'snapshots list': shouldNodejitsuOk(function setup() {

    // Rest the package.json of our fixture app
    var packageFile = path.join(__dirname, '..', 'fixtures', 'example-app', 'package.json');
    var pkg = {
      name: 'example-app',
      subdomain: 'example-app',
      scripts: { start: 'server.js' },
      version: '0.0.0'
    };

    fs.writeFileSync(packageFile, JSON.stringify(pkg))

    // Change directories
    process.chdir(path.join(__dirname, '..', 'fixtures', 'example-app'));


    nock('http://api.mockjitsu.com')
      .get('/apps/tester/example-app/snapshots')
      .reply(200, {
        snapshots: [{
          id: '0.0.0', 
          ctime: new Date(), 
          md5: 'q34rq43r5t5g4w56t45t'
        }] 
      }, { 'x-powered-by': 'Nodejitsu' });
  })
}).export(module);

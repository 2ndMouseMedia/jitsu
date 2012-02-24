/*
 * package-test.js: Tests for `jitsu package *` command(s).
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */
 
var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    flatiron = require('flatiron'),
    nock = require('nock'),
    vows = require('vows'),
    jitsu = require('../../lib/jitsu'),
    macros = require('../helpers/macros');

var shouldNodejitsuOk = macros.shouldNodejitsuOk;

vows.describe('jitsu/commands/package').addBatch({
  'package create': shouldNodejitsuOk(
    'should create the target tarball',
    function (_, err) {
      var tmproot = jitsu.config.get('tmproot'),
          targetPackage = path.join(tmproot, 'tester-example-app-0.0.0-2.tgz');
      
      try {
        fs.statSync(targetPackage);
      }
      catch (ex) {
        assert.isNull(ex);
      }
    },
    function setup() {
      var tmproot = jitsu.config.get('tmproot'),
          targetPackage = path.join(tmproot, 'tester-example-app-0.0.0-2.tgz');
      
      jitsu.argv.noanalyze = true;
      jitsu.prompt.override['invite code'] = 'f4387f4';
      
      //
      // Change directory to the sample app
      //
      process.chdir(path.join(__dirname, '..', 'fixtures', 'example-app'));
      
      //
      // Attempt to remove any existing tarballs
      //
      try { fs.unlinkSync(targetPackage) }
      catch (ex) { }
    }
  ),
}).export(module);

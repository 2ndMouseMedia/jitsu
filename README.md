# jitsu
CLI tool for easily deploying node.js applications on the Nodejitsu platform 

## Overview

[Jitsu](http://github.com/nodejitsu/jitsu) is a [Command Line Tool (CLI)](http://en.wikipedia.org/wiki/Command-line_interface) for interacting with the Nodejitsu platform. It's open-source and easy to use. We've designed Jitsu to be suitable for command line beginners, but still be powerful and extensible enough for production usage. If you aren't a fan of the command line or don't have terminal access you can still do everything Jitsu can do through our web admin, [Samurai](http://nodejitsu.com). 

Jitsu requires the npm, the node package manager.


## Installation

   [sudo] npm install jitsu

## Features

We built this CLI using some amazing technologies we've been actively building with the community since 2009. jitsu is fully extendable and extremely modular ( see Libaries section).

 - Allows for seamless deployment of your Node.js applications to the cloud
 - Command Line Interface (CLI) maps directly to Nodejitu's public API
 - Fully supports NPM dependency resolution on deployment to Nodejitsu
 - Integrated multi-level multi-transport logging support via Winston
 
## Usage

After installation, simply run the `jitsu` command from your command line. If it's your first time using `jitsu`, you will be prompted to login with an existing account or create a new account.

## Command Line Options

### Help

     jitsu help
     jitsu help apps
     jitsu help snapshots
     jitsu help users
     jitsu help config

### Need more?
The documentation for `jitsu` and the Nodejitsu APIs is open-source and a work in-progress. For more information checkout the [Nodejitsu Handbook](http://github.com/nodejitsu/handbook)

#### (C) Copyright 2010, Nodejitsu Inc.
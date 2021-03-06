# Part 1: The JavaScript Toolchain

JavaScript isn't exclusive to the web browser any more.  The modern JavaScript
toolchain has tools to help you:

* build your own back-end HTTP server,
* use and distribute code modules,
* automate build and testing tasks.

In this section, we'll describe the tools that we'll be using for the
rest of the course.

## Source Control: [Git](http://git-scm.com/)

`git` is a distributed versioning system for source code.  It allows developers
to collaborate on the same codebase without stepping on each other's toes.  It
has become the de-facto source control system for open source development
because of it's decentralized model and cheap branching features.

## The Command Line

JavaScript development tools are very command-line oriented.  If you come from
a Windows background you may find this unfamiliar.  However the command-line
provides better support for automating development tasks, so it's worth getting
comfortable with it.

We will provide examples for all command-line activities required by this
course.

## Command-line JavaScript: [Node.JS](http://nodejs.org)

NodeJS is an environment that lets you write JavaScript programs that live
outside the browser.  It provides:

* the V8 JavaScript interpreter
* modules for doing OS tasks like file I/O, HTTP, etc.

## Back-End Code Sharing and Distribution: [npm](https://www.npmjs.com/)

`npm` is the "node package manager".  It installs with NodeJS, and gives you
access to a wide variety of 3rd-party JavaScript modules.

It also does dependency management for your back-end application.  You specify
module dependencies in a file called `package.json`; running `npm install`
will resolve, download and install your back-end application's dependencies.

## Front-End Code Sharing and Distribution: [bower](https://bower.io)

`bower` is very similar to nodeJS, but for the front-end part of your application.
Any frameworks or 3rd-party libraries that need to be accessible in the user's
browser will be managed by `bower`.

Similarly to `npm`, `bower` tracks dependencies in a file called `bower.json`.
Running `bower install` will resolve, download, and install them.

## Task Automation

Even though JavaScript is an interpreted language, any non-trivial JavaScript
application will have 'build-time' tasks that need to be executed as part of
deployment.  Examples include:

* minifying JavaScript code
* compiling CSS meta-languages like [less](http://lesscss.org) or [sass](http://sass-lang.com)
* running unit tests
* starting up the back-end.

For this course, we'll be using a task runner called [gulp](http://gulpjs.com/).

If you come from a java or C background, `gulp` conceptually fills the role of
`ant` or `make` (although the implementation is quite different).

At a high level, it allows you to specify 'build targets' for the various tasks
you need to automate.

`gulp` build targets are specified in a file called `Gulpfile.js`.

## Chrome

Chrome is the web browser from Google.  We will be using it for this course
because of it's cutting-edge JavaScript engine and excellent debugging tools.

Code written with AngularJS should work on any modern web browser however
(Firefox, IE9+, Chrome, Safari).

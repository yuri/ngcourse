# Part 0: Setup

Each attendee should come to the course with their own computer, so that they
could follow the steps. We also ask all attendees to complete the following
installation steps before the first day of the course.

## The Command Line Terminal

The AngularJS tool-chain is quite command-line oriented, so we recommend
installing a good command line terminal program. For OSX we recommend iTerm2:

<http://iterm2.com/>

For Windows, we've had good experience with Console2:

<http://yuserinterface.com/dev/2013/01/05/console2-a-better-command-prompt-for-windows/>

However, we have also heard good things about ConEmu:

<http://www.hanselman.com/blog/ConEmuTheWindowsTerminalConsolePromptWeveBeenWaitingFor.aspx>

Which specific tool to use is up to each attendee, but you will want something
like this rather than struggling with the Windows "Command Prompt" tool.

## Git

We'll be using git from the command line:

<http://git-scm.com/download/>

There are tools that provide a GUI interface for git, for both OSX and
Windows. Attendees who are proficient with git and prefer to use those tools
can do so if they wish. However, all of our instructions will be for the
command line, so we recommend having this available as a backup.

## Node.JS

<http://nodejs.org/download/>

This should install two commands: "node" and "npm".

## Google Chrome and Batarang

Please install a recent version of Google Chrome, since we'll be using
tools that assume it.

Once you have installed Chrome, please install Angular Batarang, which is an
Google Chrome extension that makes it easier to debug and inspect Angular
applications. You can get it from the Google Webstore here:
[Angular Batarang](https://chrome.google.com/webstore/detail/angularjs-batarang/ighdmehidhipcmcojjgiloacoafjmpfk?hl=en-US&utm_source=chrome-ntp-launcher)

## Postman HTTP Client

Postman is our preferred tool for interacting with a REST API server.

<http://www.getpostman.com/>

Postman is less essential and if you have another HTTP client that you prefer, this is fine too.

## A Code Editor

Any text editor will work. At rangle.io the most popular editors/IDEs are
Sublime Text 2, WebStorm, VIM, and Atom. We also hear good things about Visual
Studio.

## Verifying the Setup

Once you have all the tools setup correctly, you should be able to do the
following steps through the command line. This is the best way to check that
git and node were installed correctly.

Clone the training repository:

```javascript
    git clone https://github.com/rangle/ngcourse.git
    cd ngcourse
```

Install bower via NPM (skip `sudo` on Windows):

```javascript
    sudo npm install -g bower
```

Install the projects bower components using bower:

```javascript
    bower install
```

*If you get an error while running this command, see the next section.*

Install http-server using npm (skip `sudo` on Windows):

```javascript
    sudo npm install -g http-server
```

Fire up the server:

```javascript
    http-server client/
```

Once you've run those commands, you should be able to access the server at
<http://localhost:8080>. If you see a login form at that point, then you did
everything correctly and are ready for the course.

## Proxy Issues

While running the above commands you might get an error saying:

```
  ECMDERR Failed to execute "git ls-remote..."
```

This most likely means that you are behind a proxy that blocks SSH access to
Github. In this case, run the following command:

```
  git config --global url."https://".insteadOf git://
```

Then re-run the failed command.

It's a somewhat blunt weapon, but should work in most cases.
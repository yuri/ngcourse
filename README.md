# Angular Course from rangle.io

This repository contains handout materials and code for rangle.io's AngularJS
training course. This is meant to be used as a part of the course, which is
normally offered as a 2-3 day event. See http://rangle.io/training/ for more
information.

## The Handouts

See the [handout](https://github.com/rangle/ngcourse/tree/master/handout) for
the handout. You can either view it in your browser or build it into a PDF
using the instructions in the README file in the handout directory.

## The Code

The repository also contains the codebase that we'll work on in throughout the
course. The project has a server and the client component. This repository
contains only the *client* code. The server code is available at
https://github.com/rangle/ngcourse-api/. You do **not** need the server code to
run the front end, however. Instead, you can access the API server deployed to
http://ngcourse.herokuapp.com/ and will develop the client-side code on your
own machine.

The students should start by checking out branch "base", which has all the
necessary configurations but no actual client side code. The "master" branch
contains the final state of the project.

You will then need to use `bower` to install the dependencies:

```bash
  sudo npm install -g bower # skip "sudo" on windows
  bower install
```

To access the front-end of the project, run a simple server such as `http-
server` with client as the root directory. You will need to install bower and
run

```bash
  sudo npm install -g http-server # skip "sudo" on windows
  http-server client -p 3000
```

(Any other static web server should do, though.)

Then point your browser to http://localhost:3000/

If you see a login screen, you are all set. You can login as "alice" with
password "x", at which point you should see a list of tasks.



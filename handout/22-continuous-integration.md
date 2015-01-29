# Part 22: Continuous Integration

## Philosophy

If you come from a Java background, you are probably familiar with __Continous
Integration__ (CI) systems.  These are setups that automatically run unit tests
and other verification actions on source code each time it is merged to the
central repository.

The philosophy behind CI is that
* The earlier you find a problem, the cheaper it is to fix.
* If tests can be automated, they should be.
* Reducing the time between writing code and running it in a realistic
  environment makes the development process faster.

Some systems take it a step further and perform __Continuous Deployment__; that
is, if all the code checks, unit tests, and integration tests pass, the code is
automatically deployed to production.

Historically, one of Java's strengths has been the large amount of tooling in
this area.

## What Does CI Mean for JavaScript?

The good news is that JavaScript has caught up dramatically in this area as
well.

A typical CI workflow for JavaScript might perform the following activities:

* Static code analysis: e.g. [jshint](https://www.npmjs.com/package/jshint) for
  JavaScript, [csslint](https://www.npmjs.com/package/csslint) for css, etc.
* Run back-end unit tests with [mocha](https://www.npmjs.com/package/mocha).
* Run front-end unit tests with [karma](https://www.npmjs.com/package/karma)
  against all the browsers you support.
* Compile any CSS preprocessors such as [sass](http://sass-lang.com/) or
  [less](http://lesscss.org/).
* Concatenate and minify your JS and CSS.

If you're going a step further into continuous deployment, many CI systems
support deploying to Heroku, Amazon Web Services, or other hosting providers.
In this case you may want to additionally:

* Deploy to a staging area.
* Run endpoint tests.
* Run integration tests.
* Deploy to production.

All of these tasks are available as gulp plugins from `npm`.  If it can be
automated using gulp, it can be added to your pre-deployment checks.

If any of the tasks fail, the build can be considered to have failed and
subsequent tasks are not executed.  Most CI systems will allow you to notify
team members via email or other channels when this happens.

Think of CI as an automated quality assurance pipeline.

There are a number of CI systems available, including:
* [CircleCI](https://circleci.com/)
* [Magnum CI](https://magnum-ci.com/)

## An Example: From GitHub to Production with CircleCI

At Rangle, we use CircleCI a lot because of it's easy setup and it has good
integration with github and Heroku.

Our typical flow is to set it up so that:

1. Whenever a developer submits a pull request, Circle-CI runs linting and unit
  tests on that branch.  If anything fails, the developer is not able to merge
  the pull request until the problems are fixed.
2. When the pull request is accepted and merged into master, Circle-CI will
  re-run the above, but also deploy to a staging area and run integration tests.
3. If those steps all pass, we'll deploy to production.

Of course, step 3 should only be enabled if you have confidence in the
sufficiency of your tests!  Doing this depends on your organization's QA
requirements and process.

Steps 1 and 2 however will give your developers the ability to iterate very
quickly against the staging area, increasing the agility of your organization.

# Part 1: Introduction to AngularJS and ngCourse

Angular is the leading open source JavaScript application framework backed by
Google. This course ("ngCourse") provides an introduction to AngularJS based
on our experience at [rangle.io](http://rangle.io).

## AngularJS, the Good Parts

Douglas Crockford's seminal book
_[JavaScript, The Good Parts](http://www.amazon.ca/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742)_
has this to say about JavaScript:

> Most languages contain good parts and bad parts. I discovered that I could
> be a better programmer by using only the good parts and avoiding the bad
> parts... JavaScript is a language with more than its share of bads parts.

Crockford goes on to point out that JavaScript also has lots of _good_ parts which
can make it a great language to use. The key is avoiding the bad parts.

(Crockford's book should be required reading for all JavaScript developers. At
rangle.io, we keep a few extra copies on hand on the off-chance that one of our
developers has not already read this great book.)

What Crockford says about programming languages applies equally well to
frameworks: most have good parts and bad parts. Our approach to AngularJS
somewhat resembles Crockford's approach to JavaScript. AngularJS does not have
nearly the same kind of warts as JavaScript, but it does have features that
will help you shoot yourself in the foot, even as many of its other features
help you build highly scalable software. This course aims to highlight "the
good parts" and to show how you can use them to your advantage.

We won't cover in depth in this course those parts of AngularJS that we avoid
in our own use of the framework. In cases were such parts are widely used in
the community, the course will mention them and explain why we believe their
usage should be minimized.

Despite this "picky" approach, however, we do think AngularJS offers great
value. This is the framework we ourselves work with predominantly. Let's talk
briefly about what are some of the things that make it great and some of the
things we'll have to keep in mind.

## MVC and MVVM

AngularJS is often described as an MVC ("Model-View-Controller") framework.
Here is how this is often illustrated:

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse/master/handout/images/simple-mvc.gif)

This picture, however, is far too simple.

First, only the most trivial applications can be understood as
consisting of a single model, a single view and a single controller. More
commonly, an application will include multiple views, multiple controllers,
and multiple data models. So, it might look more like this:

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse/master/handout/images/mvvm-initial.gif)

The figure above makes another important substitution, however. "Controllers"
are replaced with "view models". Angular can be better understood as a "MVVM"
("Model-View-ViewModel") framework. In this approach, we have "view models"
mediating between views and (data) models. While this may seem like just a
minor change of terminology, the idea of "view model" helps clarify the path
towards better AngularJS architecture. A view model is a mediating object that
takes data from a data model and presents it to a view in a "digested" form.
Because of that, the view model superficially looks like a model. It should
not be confused with the application's real data models. Misusing the view
model as the model is one of the most common sources of problems in AngularJS.

Now let's see how MVVM model is realized in AngularJS.

## View Synchronization

Most introductions to Angular start with a look at the "front-end" of the
framework. Let's do the same here, even though most of your AngularJS code
should be in the model layer.

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse/master/handout/images/mvvm-front-end.gif)

AngularJS views are HTML templates that are extended with custom elements and
attributes called "directives". AngularJS provides you with a lot of
directives and you will also be developing some yourself.

Views are linked with view models that take the form of "controllers" and
custom "directives". In either case we are looking at some code that controls
JavaScript objects (the actual "view model") that are referenced in the
templates. Angular refers to those as "scopes." AngularJS automatically
synchronizes DOM with view models through what it calls "two way data
binding": when an property of a view model is changed, the DOM is updated to
reflect it and when an input field is changed in the DOM, the view model is
updated.

This makes AngularJS very "designer-friendly": designers can modify HTML
templates without worrying too much about the code. The reverse is also true:
as long as there is a designer on the team, developers are largely freed from
worrying about HTML and CSS.

Angular "scopes" (view models) can be organized into a hierarchy that partly
mirrors DOM structure. We strongly recommend avoiding this, however, because
such a design introduces complex dependencies and make testing difficult.
Instead, we recommend keeping view models isolated and doing as little work as
possible. Instead, most of the work (in particular, all of the business logic)
should be moved to the lower "model" level.

More generally, it is important to understand that view models are a temporary
staging area for your data on the way to the view. They should not be abused
by being forced to act as your primary model.

## Models in Services

AngularJS does provide us with a great way to implement our data models at
arms length from the views using a mechanism called "services".

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse/master/handout/images/mvvm-final.gif)

Services are singleton objects that normally do not concern themselves with
the DOM but instead take care of your data. The bulk of your application's
business logic should belong in services. We'll spend a lot of time talking
about this.

Services get linked together through an approach that AngularJS calls
"dependency injection". This is also how they are exposed to view models
(controllers and custom directives).

In the case of Angular, what "dependency injection" practically means is that
view models do not get to create and define their dependencies. Instead,
services are created _first_, before any part of the view-model layer is
instantiated. Each component's definition specifies what dependencies should
be provided to the component.

Angular's dependency injection is one of the best things about the framework.
This approach makes your code more modular, reusable, and easier to test.
Those features are essential when building larger applications.

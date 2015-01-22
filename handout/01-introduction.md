# Part 1: Introduction to AngularJS and ngCourse

Angular is the leading open source JavaScript application framework backed by
Google. This course ("ngCourse") provides an introduction to AngularJS based
on experience of [rangle.io](http://rangle.io).

## AngularJS, the Good Parts

Douglas Crockford's seminal book
_[JavaScript, The Good Parts](http://www.amazon.ca/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742)_
has this to say about JavaScript:

> Most languages contain good parts and bad parts. I discovered that I could
> be a better programmer by using only the good parts and avoiding the bad
> parts... JavaScript is a language with more than its sahre of bads parts.

He goes on to point out that JavaScript also has lots of _good_ parts which
can make it a great language to use. The key is avoiding the bad parts.

Crockford's book should be required reading for all JavaScript developers. At
rangle.io, we keep a few extra copies on hand on the of chance that one of our
developers has not already read this great book.

Our approach to AngularJS somewhat resembles Crockford's approach to
JavaScript. AngularJS does not have the same kind of warts as JavaScript, but
it does have features that will help you make your code cleaner as well as
features that will help you shoot yourself in the foot. This course aims to
highlight "the good parts" and to show how you can use them to your advantage.

We avoid covering in depth in this course those parts of AngularJS that we
avoid in our own use of the framework. In those cases that such parts are
widely used in the community, the course will mention them and explain why we
believe their usage should be minimized.

Despite this "picky" approach, however, we do think AngularJS offers great
value. This is the framework we ourselves work with predominantly. Let's talk
briefly about what are some of the things that make it great and some of the
things we'll have to keep in mind.

## MVC and MVVM

AngularJS is often described as an MVC ("Model-View-Controller") framework.
Here is how this is often illustrated:



However, Angular can be better understood as a "MVVM" ("Model-View-ViewModel")
framework. Additionally, only the simplest applications can be understood as
consisting of a single model, a single view and a single view-model. More
commonly, an application will include multiple views, multiple view-models,
and multiple models. So, the reality often looks closer to this.

How does this map onto AngularJS?

## View Synchronization

Views: HTML templates.

Views go hand-in-hand with controllers and directives, which introduces behaviours
to the DOM.

View models, controllers and directives.

Automatic view synchronization.

Angular supports two way data binding.  For example, a variable in the controller scope can
be bound to the view and updates in the model will be reflected in the view and vice versa.

Digest cycle.

Designer-friendly.

The importance of not abusing view models. View models are not models.

Angular "scopes" (view models) can be organized into a hierarchy that partly
mirrors DOM structure. We strongly recommend avoiding this, because such design introduces complex
dependencies and make testing difficult. Instead, we recommend keeping view models isolated and doing as little work as possible. Instead, most of the work (in particular, all of the business logic) should be moved to the lower "model" level.

The same applies to directives.

## Model in Services

Your "real" models should be implemented using AngularJS services.

Services are singletons that can be dependency injected into controllers,
directives and other services.  The bulk of your application's business logic
should belong in services. We'll spend a lot of time talking about this.

Services get linked together through an approach that AngularJS calls
"dependency injection". This is also how they are exposed to the controllers.
In case of Angular, what "dependency injection" practically means is that the
view layer does not get to create and define services. Rather, services are
created _first_, before any part of the view-model layer is instantiated. Each
component's definition specifies what dependencies will be provided to the
component.

This approach makes your code more modular, reusable and easier to test. 
For example, you can inject your code into your unit test.

### Data Binding in Angular

Angular supports two way data binding.  For example, a variable in the controller scope can
be bound to the view and updates in the model will be reflected in the view and vice versa.
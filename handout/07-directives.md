# Part 7: Custom Directives

## Built in and 3rd Party Directives

Angular's built-in directives are essential to angular. Also, 3rd party
directives, such as those provided by Ionic can also provide an excellent
interface.

```html
  <ion-slide-box on-slide-changed="content.switchSlide(index)">
    <ion-slide ng-repeat="item in content.items">
      {{item.name}}
    </ion-slide>
  </ion-slide-box>
```

Ionic provides a great example of how to use directives well. We'll see a few
more examples from them later.

## Beware Bad Directives

Do watch out for poorly thought out directives that aim to provide an Angular
style wrapper around popular libraries.

## Developing Your Own Directives: When Should You Do It?

When should you develop your own custom directives? Before we consider that,
we need to clarify what we are comparing directives with.

Directives may sometimes seem cleaner than "fat" controllers, that is
controllers that contain a lot of logic. However, you should not be writing
"fat" controllers in the first place.

Directives may also seem to provide better encapsulation compared compared to
controllers with nested scope. However, you should usually avoid controllers
with nested scopes and instead use "controller as" pattern.

What we want to focus on is whether we should use directives instead of
writing "good" controllers.

##  Case 1: Reuse

Consider using directives when you the same markup is repeated multiple times.
However, keep in mind that some alternative solutions to repeated markup could
be prefered, such as:

* Using less HTML and relying more on CSS.
* Using `ng-repeat`
* Using `ng-include` (when you do not really need isolation)
* Consider ui-router (for elements that need to be included on many pages)

## Case 2: DOM Manipulation

Directives give you access to the DOM element and manipulating DOM from the
directive is usually considered better. (Though, you _can_ also do this from a
controller.)

Keep in mind that heavy-duty DOM manipulation should actually be offloaded to
services. What's important to avoid is services that query for elements
jQuery-style. Services that provide methods that take a DOM element as an
argument and manipulate is often better to manipulating DOM directly in the
directive.

## Case 3: Isolation

The most important use of directives is in providing a high degree of
isolation. Beware, however, false isolation: directives that create an
illusion of isolation without delivering any of its benefits.

Consider an integrated design where controllers inherit scopes:

```html
  <div ng-controller="EditorCtrl">
    <div ng-controller="DeleteDialogCtrl">
      <ul ng-controller="ContentCtrl">
        <li ng-repeat="item in items">
          {{item.name}}
          <button ng-click="edit(item)">
            Edit
          </button>
          <button ng-click="showDeleteDialog(item)">
            Delete
          </button>
        </li>
      </ul>
    </div>
  </div>
```

The following design may seem "cleaner" at first:

```html
  <div ng-controller="EditorCtrl">
    <div ng-controller="DeleteDialogCtrl">
      <ul ng-controller="ContentCtrl">
        <li ng-repeat="item in items" my-item-directive="{{item}}">
        </li>
      </ul>
    </div>
  </div>
```

However, in reality, the implementation of `my-item-directive` would need to
make assumptions about scope, so the directive just sweeps the messy design
under the rug.

Directives are most useful when they can be fairly isolated and make few
assumptions about the context in which they are dropped.

## Defining a Really Basic Directive

```javascript
  .directive('ergUser',
    function () {
      return {
        restrict: 'E', // vs 'A', 'AE'
        replace: true,
        scope: {}, // vs 'true', 'null'
        template:'<span>user</span>'
      };
    }
  )
```

## Transclusion

```javascript
  .directive('ergUser',
    function () {
      return {
        restrict: 'E', // vs 'A', 'AE'
        replace: true,
        transclude: true,
        scope: {}, // vs 'true', 'null'
        template:'<span>user <div ng-transclude/></span>'
      };
    }
  )
```

## Using An External Template

```javascript
  .directive('ergUser',
    function () {
      return {
        restrict: 'E', // vs 'A', 'AE'
        replace: true,
        scope: {}, // vs 'true', 'null'
        templateUrl:'/app/components/users/user.html'
      };
    }
  )
```

## Linking

```javascript
  .directive('ergUser',
    function () {
      var directive = {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: '/user/user.html'
      };
      directive.link = function(scope, element, attrs) {
        ...
      };
      return directive;
    }
  )
```

## External Communication: Services

At the moment our directive is fully isolated. In order to be of much use,
though, it would need to connect with the rest application.

There are a few ways of doing this, but our best approach is often to rely on
services at least for a large part of that communication.

```javascript
  .directive('ergUser', ['users',
    function (users) {
      ...
      directive.link = function(scope, element, attrs) {
        scope.name = users.getName();
        ...
      };
    ...
    }
  ])
```

## Using Attributes

If we want some of the data to come from the scope, we can provide it via an
argument. The most isolated way is to pass it in as a string value.

If we want to use the directive like this:

```html
  <erg-user username="alice"></erg-user>
```

we would need to define it this way:

```javascript
  directive.scope = {
    username: '@username'
  };
  directive.link = function(scope, element, attrs){
    scope.user = users.getUser(scope.username);
  };
```

In this case the value of `username` argument is placed on the directive's
scope. The directive would then take it from there, using a service to get
more details.

## External 2-way Binding

Alternatively, we may want to bind a property of the directive's scope to a
specific property of the parent scope. In other words, we want to be able to
use the directive as follows:

```html
  <erg-user username="user"></erg-user>
```

where "user" is a name of a variable on the scope.

We'll then need to setup the directive as follows:

```javascript
  directive.scope = {
    username: '=username'
  };
  directive.link = function(scope, element, attrs){
    scope.user = users.getUser(scope.username);
  };
```

## Binding Handlers

Finally, we may want to use attributes to allow the external scope to provide
handlers for events fired from within the directive.

For example, suppose our directive would provide us with UI elements that
would allow us to "ban" the user.

```html
  <erg-user username="user" on-ban="handleBan(user)"></erg-user>
```

We would then define the directive as follows:

```javascript

  directive.scope = {
    fireBan: '&onBan'
  };
  directive.link = function(scope, element, attrs){
    ...
    scope.fireBan();
    ...
  };
```

However, consider using a service instead.

## Attribute Processing

It's important to remember, though, that we do not _have_ to map attributes to directive's scope elements. Instead, our directive can just access attribute values directly.

```javascript
  directive.scope = {};
  directive.link = function(scope, element, attrs){
    var username = attrs.username;
  };
```

## Parsing Expressions

One neat thing we can do is use an attribute to provide an expression that
would be used by the directive:

```html
  <erg-user username="{{user}}" cost="hours * rate"></erg-user>
```

We set up the directive as follows:

```javascript
  directive.link = function(scope, element, attrs) {
    var userData = users.getUser(scope.username);
    var getCost = $parse(attrs.cost);
    scope.cost = getCost({
      rate: userData.rate,
      hours: userData.cost,
      discount: userData.discount
    });
  };
```

## Using the Compile Function

You will rarely need to use directive's `compile()` and most examples of using
it a rather contrived. Let's consider one use case for completeness.

Suppose we want to clone the widget created by the directive a number of
times, where the number would be specified in an attribute:

```html
  <erg-user username="{{user}}" cost="hours * rate" repeat="5"></erg-user>
```

We can achieve this by providing a compile function which will handle the
cloning:

```javascript
  directive.compile = function (tElement, tAttrs) {
    var wrapper = angular.element('<div></div>');
    for (var i=0; i<tAttrs.repeat; i++) {
      wrapper.append(tElement.clone());
    }
    tElement.replaceWith(wrapper);
    return function (scope, iElement, iAttrs) {
      ...
      };
    };
```

## Directives and Services

If you want to control the directive's behaviour from outside, it is usually
best to use a service. For example, Ionic provides us with a service
`$ionicSlideBoxDelegate` to control slide boxes.

```javascript
  $ionicSlideBoxDelegate.$getByHandle('users').update();
```

## Directives, Services and DOM

You should generally avoid DOM manipulation in Angular. When you need to do
it, though, the best approach is usually to capture the element in a directive
and then offload the actual manipulation to a service dedicated to this:

```javascript
  directive.link = function(scope, element, attrs) {
    scope.scroller = scroller.makeScroller(
    attrs.id, element);
  };
```

## Testing Directives

We can test a directive as follows:

```javascript
  element = $compile(template)(scope);
  element.click();
  user.select.should.have.been.calledOnce;
```

If our directive relies on a template in an external file, those templates
would need to be loaded somehow. One common approach is to use  ng- html2js
preprocessor to convert templates in to JavaScript files, after which they can
be required as modules.

Keep in mind, however, that your time may be better spent on refactoring your
code to maximize the amount of work that you do in services and writing tests
for those services.



## Installing Protractor and Selenium

We'll be using rangle-gulp (install version 0.0.7) to run protractor, but we'll need to have selenium installed. For that, we'll need to install protractor first.

```bash
  sudo npm install -g protractor
  sudo webdriver-manager update --standalone
  sudo webdriver-manager start
```

This starts selenium on port 4444.

## Writing a Simple Test

```javascript
  describe('localhost', function() {
    it('should allow login', function() {
      var displayName;
      browser.get('http://localhost:8080/');
      element(by.model('loginForm.username')).sendKeys('alice');
      element(by.model('loginForm.password')).sendKeys('x');
      element(by.id('login-button')).click();
      displayName = element(by.binding('main.user.data.displayName')).getText();
      expect(displayName).toEqual('Alice');
    });
  });
```

Note: we'll be using Jasmine in this case.

## Running the Test

Our protractor config:

```javascript
  exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub'
  }
```

We'll configure our protractor task as follows:

```javascript
  gulp.task('protractor', rg.protractor({
    files: [
      'client/testing/scenarios/*.scenario.js'
    ]
  }));
```

Now we can run our test:

```bash
  gulp protractor
```

## Running Protractor Interactively

```bash
  node node_modules/rangle-gulp/node_modules/gulp-protractor/node_modules/protractor/bin/elementexplorer.js http://localhost:8080/
```

## Debugging

Add this to the test code:

```javascript
  browser.debugger();
```

In the console:

```javascript
  window.clientSideScripts.findByModel('login.Username');
```

## More Locators

```javascript
  var tasks = element.all(by.repeater('task in taskList.tasks'));
  expect(tasks.count()).toEqual(3);

  var owners = element.all(by.binding('task.owner'));
  expect(owners.count()).toEqual(3);
```

## Using Protractor Instance

```javascript
  var ptor = protractor.getInstance();
  var button = by.id('login-button');

  expect(ptor.isElementPresent(button)).toBe(true);
  expect(element(button).isDisplayed()).toBe(true);

```
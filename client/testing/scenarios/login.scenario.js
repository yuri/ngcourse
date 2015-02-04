describe('localhost', function() {
  it('should allow login', function() {
    browser.get('http://localhost:8080/');
    element(by.model('loginFormCtrl.username')).sendKeys('alice');
    element(by.model('loginFormCtrl.password')).sendKeys('x');
    element(by.id('login-button')).click();

    var displayName = element(by.binding('main.userDisplayName')).getText();
    expect(displayName).toEqual('Alice Beeblebrox');

    var tasks = element.all(by.repeater('task in taskList.tasks'));
    expect(tasks.count()).toEqual(6);

    var owners = element.all(by.binding('task.owner'));
    expect(owners.count()).toEqual(6);
  });
});

describe('localhost', function() {
  it('should check for element presence', function() {
    browser.get('http://localhost:8080/');
    var button = by.id('login-button');

    expect(browser.isElementPresent(button)).toBe(true);
    expect(element(button).isEnabled()).toBe(false);
  });
});

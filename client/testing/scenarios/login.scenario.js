describe('localhost', function() {
  it('should allow login', function() {
    browser.get('http://localhost:8080/');
    element(by.model('loginForm.username')).sendKeys('alice');
    element(by.model('loginForm.password')).sendKeys('x');
    element(by.id('login-button')).click();
    
    var displayName = element(by.binding('main.user.data.displayName')).getText();
    expect(displayName).toEqual('Alice Beeblebrox');

    var tasks = element.all(by.repeater('task in taskList.tasks'));
    expect(tasks.count()).toEqual(3);

    var owners = element.all(by.binding('task.owner'));
    expect(owners.count()).toEqual(3);
  });
});

describe('localhost', function() {
  it('should check for element presence', function() {
    browser.get('http://localhost:8080/');
    var ptor = protractor.getInstance();
    var button = by.id('login-button');

    expect(ptor.isElementPresent(button)).toBe(true);
    expect(element(button).isDisplayed()).toBe(true);
  });
});
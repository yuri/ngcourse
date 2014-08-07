
var numbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10
]

// numbers.forEach(function(x) {
//   console.log(x + ' cats');
// });

function makeIterator(animal) {
  return function(x) {
    console.log(x + ' ' + animal);
  }
}

var iterator;
var today = 'Thursday';

if (today === 'Thursday') {
  iterator = makeIterator('cats');
} else {
  iterator = makeIterator('cows');
}

numbers.forEach(cowIterator);

promise.then(handler);

function processResults () {

}

promise.then(processResults);

promise.then(function(results) {

});

promise.then(makeHandler())

var handlerFunction = makeHandler();

promise.then(handlerFunction);

function sendErrorToServer(error) {
  //
}

function showMessage(message) {
  //
}



return getTasks()
  .then(null, function(error) {
    showMessage('Sorry, could not get tasks.');
    sendErrorToServer(error);
  });

return saveNewTask()
  .then(null, function(error) {
    showMessage('Sorry, could not get save the task.');
    sendErrorToServer(error);
  });

return changePassword()
  .then(null, function(error) {
    showMessage('Sorry, could change password.');
    sendErrorToServer(error);
  });

function handleError(error, message) {
  showMessage(message);
  sendErrorToServer(error);
}

return getTasks()
  .then(null, function(error) {
    handleError(error, 'Sorry, could not get tasks.');
  });

return saveNewTask()
  .then(null, function(error) {
    handleError(error, 'Sorry, could not get save the task.');
  });

return changePassword()
  .then(null, function(error) {
    handleError(error, 'Sorry, could change password.');
  });

return changePassword()
  .then(null, handleError(error, 'Sorry, could change password.'));

function makeErrorHandler(message) {
  var x = 2;
  return function(error) {
    showMessage(message);
    sendErrorToServer(error);
  };
}

return changePassword()
  .then(null, makeErrorHandler('Sorry, could change password.'));

////////////////////////////////////////////////////////////////


function makeUser(username, truePassword) {
  var user = {
    username: username,
    verifyPassword: function(enteredPassword) {
      return enteredPassword === truePassword;
    }
  }
  return user;
}

var alice = makeUser('alice', '123');

alice.verifyPassword('135');

alice.verifyPassword = function(enteredPassword) {
  return true;
}


.service('user', function () {
  var service = {};

  var lossOfAuthCallbacks = [];

  service.onLossOfAuth = function(callback) {
    lossOfAuthCallbacks.push(callback);
  };

  function fireLossOfAuth() {
    lossOfAuthCallbacks.forEach(function(callback) {
      callback();
    });
  };
})

.controller('MainCtrl', function(user) {

  user.onLossOfAuth(function() {
    scope.contentIsVisible = false;
  });

});



















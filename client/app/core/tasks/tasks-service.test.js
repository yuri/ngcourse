  'use strict';

  var expect = chai.expect;
   // move expect definitin to client/testing/test-utils.js

  xdescribe('tasks service', function() {
      // Load the angular module. Having smaller modules helps here.
      beforeEach(module('erg.tasks'));
      it('should get loaded', function() {
          // Inject the service.
          inject(function(tasks) {
              // Notice that the service is available inside the closure.
              // We can assert that the service has loaded.
              expect(tasks).to.not.be.undefined;
              expect(tasks.getTasks()).to.not.be.undefined;
          });
      });

      it('should get tasks', function(done) {
          // Notice that we've specified that our function takes a 'done' argument.
          // This tells Mocha this is an asynchronous test. An asynchronous test will
          // not be considered 'successful' until done() is called without any
          // arguments. If we call done() with an argument the test fails, treating
          // that argument as an error.
          inject(function(tasks, $rootScope, $httpBackend, API_BASE_URL) {

              $httpBackend.when('GET', API_BASE_URL + '/api/v1/tasks').respond(200);


              tasks.getTasks()
              // Attach the handler for resolved promise.
              .then(function(tasks) {
                  // Assertions thrown here will result to a failed promise downstream.
                  expect(tasks).to.be.an.array;
                  // Remember to call done(), othewise the test will time out (and
                  // fail).
                  done();
              })
              // Attach the error handler. This is very important and easy to forget.
              .then(null, function(error) {
                  done(error); // This can be simplified - see below.
              });
              $httpBackend.flush();
              $rootScope.$apply();
          });

      });

  });

  describe('tasks service2', function() {
      // Load the angular module. Having smaller modules helps here.
      beforeEach(module('erg.tasks'));
      beforeEach(module('erg'));
      beforeEach(module(function($provide) {
          // Mock 'server'.
          $provide.service('server', function() {
              var service = {};
              var data = [{
                  description: 'Mow the lawn'
              }];

              service.get = sinon.spy(function() {
                  return Q.when(data);
                  // or try this: Q.reject(new Error('Some Error'));
              });
              return service;
          });
          // Mock $q.
          $provide.service('$q', function() {
              return Q;
          });
      }));

      function getService(serviceName) {
          var injectedService;
          inject([serviceName,
              function(serviceInstance) {
                  injectedService = serviceInstance;
              }
          ]);
          return injectedService;
      }


      xit('should get tasks', function(done) {
          // Notice that we've specified that our function takes a 'done' argument.
          // This tells Mocha this is an asynchronous test. An asynchronous test will
          // not be considered 'successful' until done() is called without any
          // arguments. If we call done() with an argument the test fails, treating
          // that argument as an error.
          inject(function(tasks) {
              tasks.getTasks()
              // Attach the handler for resolved promise.
              .then(function(tasks) {
                  // Assertions thrown here will result to a failed promise downstream.
                  expect(tasks.length).to.equal(1);
                  // Remember to call done(), othewise the test will time out (and
                  // fail).
                  done();
              })
              // Attach the error handler. This is very important and easy to forget.
              .then(null, function(error) {
                  done(error); // This can be simplified - see below.
              });
          });
      });

      it('should get tasks', function() {
          var tasks = getService('tasks');
          var server = getService('server');
          return tasks.getTasks()
              .then(function(receivedTasks) {
                  expect(receivedTasks.length).to.equal(1);
                  server.get.should.have.been.calledOnce;
              });
      });

      it('testing the controller', function(done) {
          inject(function($controller, $rootScope) {
              // Create a scope.
              var scope = {};
              // Instantiate a controller with the new scope.
              var ctrl = $controller('TaskListCtrl', {
                  $scope: scope
              });
              // Wait for the controller to run.
              setTimeout(function() {
                  expect(ctrl.tasks.length).to.equal(1);
                  done();
              }, 100);
          });
      });

  });

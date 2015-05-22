'use strict';

import {InjectableReceiver} from 'utils/injectable-receiver';

class TasksService extends InjectableReceiver {

  constructor () {
    super(arguments);
    this.addMethods();
  }

  makeAuthenticatedMethod(functionToDelay) {
    return function () {
      var myArgs = arguments;
      return this.services.koast.user.whenAuthenticated()
        .then(function () {
          return functionToDelay.apply(this, myArgs);
        });
    };
  }

  addMethods() {
    this.getTasks = this.makeAuthenticatedMethod(
      () => this.services.koast.queryForResources('tasks')
    );

    this.addTask = this.makeAuthenticatedMethod(
      (task) => this.services.koast.createResource('tasks', task)
    );

    this.updateTask = this.makeAuthenticatedMethod(
      (task) => task.save()
    );

    this.getTask = this.makeAuthenticatedMethod(
      (id) => this.services.koast.getResource('tasks', { _id: id})
    );
  }
}
TasksService.$inject = ['koast'];

export {TasksService};
'use strict';

import {InjectableReceiver} from 'utils/injectable-receiver';

class TaskListCtrl extends InjectableReceiver {
  constructor() {
    super(arguments);
    this.tasks = [];
    this.addTask = this.services.router.goToAddTask;
    this.getUserDisplayName = this.services.users.getUserDisplayName.bind(this.services.users);
    this.loadInitialTasks();
  }

  loadInitialTasks() {
    let tasks;
    this.services.tasks.getTasks()
      .then(newTasks => tasks = newTasks)
      .then(() => this.services.users.whenReady())
      .then(() => this.tasks = tasks)
      .then(null, this.services.$log.error);
  }

  // get addTask() { return this.services.router.goToAddTask; }
};
TaskListCtrl.$inject = ['$log', 'tasks', 'users', 'router'];

export {TaskListCtrl};

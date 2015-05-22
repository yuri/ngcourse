'use strict';

import {InjectableReceiver} from 'utils/injectable-receiver';

class TaskAddCtrl extends InjectableReceiver {
  constructor() {
    super(arguments);
    this.cancel = this.services.router.goToTaskList;
  }

  save(task) {
    return this.services.tasks.addTask(task)
      .then(() => this.services.router.goToTaskList())
      .then(null, this.services.$log.error);
  };
};

TaskAddCtrl.$inject = ['$log', 'router', 'tasks'];

export {TaskAddCtrl};
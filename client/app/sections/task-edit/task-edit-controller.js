import {InjectableReceiver} from 'utils/injectable-receiver';

class TaskEditCtrl extends InjectableReceiver {
  constructor() {
    super(arguments);
    this.services.tasks.getTask(this.services.$stateParams._id)
      .then((response) => this.task = response)
      .then(null, this.services.$log.error);

    this.cancel = this.services.router.goToTaskList;
  }

  updateTask (task) {
    this.services.tasks.updateTask(task)
      .then(this.services.router.goToTaskList)
      .then(null, this.services.$log.error);
  }
}

TaskEditCtrl.$inject = ['$http', '$log', 'tasks', '$stateParams', 'router'];

export {TaskEditCtrl};
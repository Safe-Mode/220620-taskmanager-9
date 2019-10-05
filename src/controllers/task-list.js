import {unrender} from '../util';
import {TaskController} from './task';
import {ModelTask} from '../model-task';

class TaskListController {
  constructor(tasks, taskList, onDataChange) {
    this._tasks = tasks;
    this._taskList = taskList;
    this._onDataMainChange = onDataChange;
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._subscriptions = [];
    this._creatingTask = null;
  }

  _onDataChange(newData, oldData) {
    const taskIndex = (oldData) ? this._tasks.findIndex((task) => task === oldData) : 0;

    if (newData === null && oldData === null) {
      this._creatingTask = null;
    } else if (newData === null) {
      if (taskIndex !== -1) {
        this._onDataMainChange(`delete`, this._tasks[taskIndex], this.unrenderTask.bind(this, taskIndex));
      }

      this._creatingTask = null;
    } else if (oldData === null) {
      this._tasks = [newData, ...this._tasks];
      this.renderTask(this._tasks[taskIndex], taskIndex);
      this._onDataMainChange(`add`, this._tasks);
    } else {
      const newTask = this._tasks[taskIndex];

      for (let key in newData) {
        if (newData.hasOwnProperty(key)) {
          newTask[key] = newData[key];
        }
      }

      newTask.id = this._tasks[taskIndex].id;
      this._onDataMainChange(`update`, newTask, this.renderTask.bind(this, newTask, taskIndex));
      // this._tasks[taskIndex] = newData;
      // this.renderTask(this._tasks[taskIndex], taskIndex);
    }
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const defaultTask = {
      description: ``,
      dueDate: Date.now(),
      repeatingDays: {},
      tags: new Set(),
      color: ``,
      isFavorite: false,
      isArchive: false,
    };

    this._creatingTask = new TaskController(this._taskList.getElement(), defaultTask, `add`, this._onDataChange, this._onChangeView);
    this._creatingTask.init();
  }

  unrenderTask(index) {
    unrender(this._taskList.getElement().children[index]);
  }

  renderTask(task, index) {
    const taskController = new TaskController(this._taskList.getElement(), task, `default`, this._onDataChange, this._onChangeView, index);

    taskController.init();
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._subscriptions = [];
  }
}

export {TaskListController};

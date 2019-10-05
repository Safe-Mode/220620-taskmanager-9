import {Status} from './const';
import {ModelTask} from './model-task';

const checkStatus = (response) => {
  if (response.status >= Status.OK && response.status < Status.MULTI) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};


const API = class {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTasks() {
    return this._load({url: `tasks`})
      .then(toJSON)
      .then(ModelTask.parseTasks);
  }

  createTask(task) {
    return this._load({
      url: `tasks`,
      method: `POST`,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTask.parseTask);
  }

  updateTask({id, data}) {
    return this._load({
      url: `tasks/${id}`,
      method: `PUT`,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTask.parseTask);
  }

  deleteTask({id}) {
    return this._load({url: `tasks/${id}`, method: `DELETE`});
  }

  _load({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export {API};

import { TestBed, waitForAsync } from '@angular/core/testing';

import { TaskService } from './task.service';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  task,
  TASK_INTERNAL_SERVER_ERROR_RESPONSE,
  TASK_UNPROCESSIBLE_ENTITY_RESPONSE,
  tasks,
} from '../../../__mocks__/task';

describe('TaskService', () => {
  let service: TaskService;
  let httpTestController: HttpTestingController;

  const MOCKED_TASKS = tasks;

  const MOCKED_TASK = task;

  const apiURL = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpTestController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestController.verify();
  });

  it('create service', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('Should return a list of tasks', waitForAsync(() => {
      service.getTasks().subscribe(response => {
        expect(response).toEqual(MOCKED_TASKS);
        expect(service.tasks()).toEqual(MOCKED_TASKS);
        expect(service.tasks()[0].title).toEqual('Comprar pão na padaria');
      });

      const req = httpTestController.expectOne(`${apiURL}/tasks`);

      req.flush(MOCKED_TASKS);

      expect(req.request.method).toEqual('GET');
    }));

    it('Should throw and error when server return Internal Server Error', () => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      service.getTasks().subscribe({
        next: () => {
          fail('failed to get tasks');
        },
        error: (error: HttpErrorResponse) => {
          httpErrorResponse = error;
        },
      });

      const req = httpTestController.expectOne(`${apiURL}/tasks`);

      req.flush('Internal Server Error', TASK_INTERNAL_SERVER_ERROR_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(500);
      expect(httpErrorResponse.statusText).toEqual('Internal Server Error');
    });
  });

  describe('createTasks', () => {
    it('Should create a new task', waitForAsync(() => {
      service.createTask(MOCKED_TASK).subscribe(() => {
        expect(service.tasks()[0]).toEqual(MOCKED_TASK);
        expect(service.tasks().length).toEqual(1);
      });

      const req = httpTestController.expectOne(`${apiURL}/tasks`);

      req.flush(MOCKED_TASK);

      expect(req.request.method).toEqual('POST');
    }));

    it('Should throw unprocessable entity with invalid body when create a task', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      service.createTask(MOCKED_TASK).subscribe({
        next: () => {
          fail('failed to add a new tasks');
        },
        error: (error: HttpErrorResponse) => {
          httpErrorResponse = error;
        },
      });

      const req = httpTestController.expectOne(`${apiURL}/tasks`);

      req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(422);
      expect(httpErrorResponse.statusText).toEqual('Unprocessable Entity');
    }));
  });

  describe('updateTasks', () => {
    it('Should update a task', waitForAsync(() => {
      service.tasks.set([MOCKED_TASK]);

      const updatedTask = MOCKED_TASK;
      updatedTask.title = 'Ir na academia treinar perna';

      service.updateTask(updatedTask).subscribe(() => {
        expect(service.tasks()[0].title).toEqual(updatedTask.title);
      });

      const req = httpTestController.expectOne(
        `${apiURL}/tasks/${updatedTask.id}`
      );

      req.flush(MOCKED_TASK);

      expect(req.request.method).toEqual('PUT');
    }));

    it('Should throw unprocessable entity with invalid body when update a task', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      service.tasks.set([MOCKED_TASK]);

      const updatedTask = MOCKED_TASK;
      updatedTask.title = 'Ir na academia treinar perna';

      service.updateTask(updatedTask).subscribe({
        next: () => {
          fail('failed to update a new tasks');
        },
        error: (error: HttpErrorResponse) => {
          httpErrorResponse = error;
        },
      });

      const req = httpTestController.expectOne(
        `${apiURL}/tasks/${updatedTask.id}`
      );

      req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(422);
      expect(httpErrorResponse.statusText).toEqual('Unprocessable Entity');
    }));
  });

  describe('updateIsCompleteStatus', () => {
    it('Should update a status of a task when is completed', waitForAsync(() => {
      service.tasks.set(MOCKED_TASKS);

      const updatedStatus = MOCKED_TASK;
      updatedStatus.title = 'Ir na academia treinar perna';

      service.updateTaskStatus(updatedStatus.id, true).subscribe(() => {
        expect(service.tasks()[0].isCompleted).toBeTruthy();
      });

      const req = httpTestController.expectOne(
        `${apiURL}/tasks/${updatedStatus.id}`
      );

      req.flush({ isCompleted: true });

      expect(req.request.method).toEqual('PATCH');
    }));

    it('Should throw an error when update a task to isCompleted status', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      service.tasks.set(MOCKED_TASKS);

      const updatedTask = MOCKED_TASK;
      updatedTask.title = 'Ir na academia treinar perna';

      service.updateTaskStatus(updatedTask.id, true).subscribe({
        next: () => {
          fail('failed to update a task to isCompleted status');
        },
        error: (error: HttpErrorResponse) => {
          httpErrorResponse = error;
        },
      });

      const req = httpTestController.expectOne(
        `${apiURL}/tasks/${updatedTask.id}`
      );

      req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(422);
      expect(httpErrorResponse.statusText).toEqual('Unprocessable Entity');
    }));
  });

  describe('deleteTasks', () => {
    it('Should delete a task', waitForAsync(() => {
      service.tasks.set(MOCKED_TASKS);

      const deletedTask = MOCKED_TASK;

      service.deleteTask(deletedTask.id).subscribe(() => {
        expect(service.tasks().length).toEqual(1);
        expect(service.tasks()[0].id).toEqual('2');
      });

      const req = httpTestController.expectOne(
        `${apiURL}/tasks/${deletedTask.id}`
      );

      req.flush(null);

      expect(req.request.method).toEqual('DELETE');
    }));

    it('Should throw unprocessable entity with invalid body when delete a task', waitForAsync(() => {
      let httpErrorResponse: HttpErrorResponse | undefined;

      service.tasks.set(MOCKED_TASKS);

      const deletedTask = MOCKED_TASK;

      service.deleteTask(deletedTask.id).subscribe({
        next: () => {
          fail('failed to delete a tasks');
        },
        error: (error: HttpErrorResponse) => {
          httpErrorResponse = error;
        },
      });

      const req = httpTestController.expectOne(
        `${apiURL}/tasks/${deletedTask.id}`
      );

      req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);

      if (!httpErrorResponse) {
        throw new Error('Error needs to be defined');
      }

      expect(httpErrorResponse.status).toEqual(422);
      expect(httpErrorResponse.statusText).toEqual('Unprocessable Entity');
    }));
  });
});

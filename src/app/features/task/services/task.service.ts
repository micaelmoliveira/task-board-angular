import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../model/task.model';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly _httpClient = inject(HttpClient);

  private readonly _apiUrl = environment.apiUrl;

  public tasks = signal<Task[]>([]);

  public numberOfTasks = computed(() => this.tasks().length);

  public getTasks(): Observable<Task[]> {
    return this._httpClient.get<Task[]>(`${this._apiUrl}/tasks`).pipe(
      tap(tasks => {
        const sortedTasks = this.getSortedTasks(tasks);
        this.tasks.set(sortedTasks);
      })
    );
  }

  public createTask(task: Partial<Task>): Observable<Task> {
    return this._httpClient.post<Task>(`${this._apiUrl}/tasks`, task);
  }

  public updateTask(updateTask: Task): Observable<Task> {
    return this._httpClient.put<Task>(
      `${this._apiUrl}/tasks/${updateTask.id}`,
      updateTask
    );
  }

  public updateTaskStatus(
    taskId: string,
    isCompleted: boolean
  ): Observable<Task> {
    return this._httpClient.patch<Task>(
      `${this._apiUrl}/tasks/${taskId}`,
      isCompleted
    );
  }

  public deleteTask(taskId: string): Observable<Task> {
    return this._httpClient.delete<Task>(`${this._apiUrl}/tasks/${taskId}`);
  }

  public insertTaskInTaskList(newTask: Task): void {
    const updatedTask = [...this.tasks(), newTask];
    const sortedTasks = this.getSortedTasks(updatedTask);

    this.tasks.set(sortedTasks);
  }

  public updateTaskInTaskList(updateTask: Task): void {
    this.tasks.update(tasks => {
      const removeUpdatedTaskFromTaskList = tasks.filter(
        task => task.id !== updateTask.id
      );
      const updatedTaskList = [...removeUpdatedTaskFromTaskList, updateTask];

      return this.getSortedTasks(updatedTaskList);
    });
  }

  public deleteTaskInTaskList(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId));
  }

  public getSortedTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => a.title.localeCompare(b.title));
  }
}

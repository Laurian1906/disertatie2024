import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Make the service available throughout the application
})
export class GameDataService {
  private selectedGameSubject = new BehaviorSubject<string>('animals'); // Set default to 'animals'

  selectedGame$ = this.selectedGameSubject.asObservable();

  setSelectedGame(game: string) {
    this.selectedGameSubject.next(game);
  }
}

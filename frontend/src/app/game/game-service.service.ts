import { Injectable } from '@angular/core';
import { GameMode } from '../card/card.component';

@Injectable({
  providedIn: 'root'
})
export class GameServiceService {
  gameMode: GameMode = GameMode.CLASSIC;
  shiftCard: boolean = false;
}

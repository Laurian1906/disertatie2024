import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, GameMode } from '../../../card/card.component';
import { GetCardPathService } from '../../../card/get-card-path.service';
import { GameServiceService } from '../../game-service.service';
import { SingleplayerComponent } from '../singleplayer.component';
import { GameDataService } from '../game-data.service';

@Component({
  selector: 'app-shift-mode',
  standalone: true,
  imports: [CommonModule, CardComponent, SingleplayerComponent],
  templateUrl: './shift-mode.component.html',
  styleUrls: ['./shift-mode.component.css']
})
export class ShiftModeComponent {
  gameMode = GameMode.SHIFT;
  @Input() selectedGame: string = 'animals';

  constructor(
    private cardPathService: GetCardPathService,
    private gameService: GameServiceService,
    private gameDataService: GameDataService // Inject GameDataService
  ) {
    this.gameDataService.selectedGame$.subscribe(game => (this.selectedGame = game));
  }

  
}
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, GameMode } from '../../../card/card.component';
import { GetCardPathService } from '../../../card/get-card-path.service';
import { GameServiceService } from '../../game-service.service';
import { GameDataService } from '../game-data.service';

@Component({
  selector: 'app-level-mode',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './level-mode.component.html',
  styleUrl: './level-mode.component.css',
})
export class LevelModeComponent {
  gameMode = GameMode.LEVEL;
  @Input() selectedGame: string = 'animals';

  constructor(
    private cardPathService: GetCardPathService,
    private gameService: GameServiceService,
    private gameDataService: GameDataService
  ) {
    this.gameService.gameMode = this.gameMode;
    this.gameService.shiftCard = false;
    this.gameDataService.selectedGame$.subscribe(
      (game) => (this.selectedGame = game)
    );
  }
}

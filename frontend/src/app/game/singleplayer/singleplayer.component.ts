import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CardComponent } from '../../card/card.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GameDataService } from './game-data.service';

@Component({
  selector: 'app-singleplayer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, RouterLinkActive, CardComponent, NgbDropdownModule],
  templateUrl: './singleplayer.component.html',
  styleUrls: ['./singleplayer.component.css']
})
export class SingleplayerComponent {
  gameTypes: { name: string; selected: boolean }[] = [
    { name: 'animals', selected: true },
    { name: 'countryFlags', selected: false },
    { name: 'flowers', selected: false },
    // Add more game types if needed
  ];

  selectedGame: string = 'animals'; // Initially selected game type

  @ViewChild(CardComponent, { static: false }) cardComponent!: CardComponent;

  constructor(private gameDataService: GameDataService) {}

  selectGameType(gameType: string) {
    this.gameTypes.forEach(type => (type.selected = false)); // Deselect all types
    const foundType = this.gameTypes.find(type => type.name === gameType);
    if (foundType) {
      foundType.selected = true; // Select the clicked type
      this.selectedGame = gameType;
      this.gameDataService.setSelectedGame(gameType); // Update shared service
      this.updateCardComponent();
    }
  }

  updateCardComponent() {
    if (this.cardComponent) {
      console.log("Updating typeOfGame in CardComponent:", this.selectedGame);
      this.cardComponent.typeOfGame = [this.selectedGame];
      this.cardComponent.refreshLevelModePage(); // Assuming this method exists
    }
  }
}

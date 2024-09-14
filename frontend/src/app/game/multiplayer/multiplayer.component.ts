import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../card/card.component';
import { WebSocketService } from './websocket.service';
import { GetCardPathService } from '../../card/get-card-path.service';
import { GameServiceService } from '../game-service.service';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-multiplayer',
  standalone: true,
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.css'],
  imports: [CommonModule, CardComponent, FormsModule],
})
export class MultiplayerComponent implements OnInit {
  multiplayer: boolean = false;
  isConnected: boolean = false;
  playerName: string = '';

  private uuid: string = uuidv4(); // Generate UUID for client identification

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    console.log('Multiplayer: Activated');
    this.webSocketService.updateMultiplayerStatus(this.multiplayer = true); // Set multiplayer on true when component is activated
  }

  sendClientData(): void {
    const clientData = {
      action: 'client',
      name: this.playerName,
      id: this.uuid, // Use generated UUID as client identifier
      clientAction: '', // Specific client action (optional)
      score: 0, // Initial score (optional)
    };

    // Send data to server using WebSocketService
    this.webSocketService.sendMessage(clientData);
    this.isConnected = true;
  }

  getUUID(): string {
    return this.uuid;
  }
}

import { Injectable, OnInit } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from './environment';
import { CardComponent } from '../../card/card.component';
import { GetCardPathService } from '../../card/get-card-path.service';
import { GameServiceService } from '../game-service.service';
import { MultiplayerComponent } from './multiplayer.component';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService{

  private webSocketUrl = environment.webSocketUrl;
  private wsSubject: WebSocketSubject<any>;
  private card: CardComponent;

  public _multiplayerScore: number = 0;
  public _playerName!: string;
  public _errorsMultiplayer: number = 0;
  
  get multiplayerScore(): number {
    return this._multiplayerScore;
  }

  get errorsMultiplayer(): number{
    return this._errorsMultiplayer;
  }

  constructor(
    private cardPathService: GetCardPathService,
    private gameService: GameServiceService,
  ) {
    this._multiplayerScore = 0;
    
    // Initialize WebSocketSubject with the server address
    this.wsSubject = webSocket(this.webSocketUrl);

    // Instantiate CardComponent with its dependencies
    this.card = new CardComponent(this.cardPathService, this.gameService, this);

    // Listen to WebSocket events to handle messages from the server
    this.wsSubject.subscribe(
      (message) => {
        // console.log('Message received from server:', message);

        if( this.card.multiplayer === true){
          if (message.action === 'cardRotated') {
            // console.log('Card rotated received from the server, yay!');
            const { cardID, isFacedUp } = message;
  
  
            this.rotateCard(cardID, isFacedUp);
            // console.log("Card rotated on all clients!!!");
          }
  
          if (message.action === 'comparisonResult') {
            this.handleComparisonResult(message);
          }
  
          if (message.action === 'scoreUpdated') {
            this.handleScoreUpdate(message.score);
            console.log(message.scores)
          }

          if (message.action === 'errorsUpdated') {
            this.handleErrorUpdate(message.error);
            console.log(message.error)
          }

          if ( message.action === 'clientData' ){
              this.handleClientNameUpdate(message.name);
              // console.log(message.name);
              this._playerName = message.name;
          }
        }


      },
      (error) => {
        console.error('WebSocket error:', error);
      },
      () => {
        console.log('WebSocket connection closed');
      }
    );
  }

  // Send a message to the server via WebSocket
  sendMessage(message: any): void {
    if (!this.wsSubject.closed) {
      this.wsSubject.next(message);
    } else {
      console.error('WebSocket connection is not open');
    }
  }

  updateMultiplayerStatus(status: boolean): void {
    this.card.multiplayer = status;
  }

  // Disconnect the WebSocket connection
  disconnect(): void {
    if (!this.wsSubject.closed) {
      this.wsSubject.complete();
    }
  }

  // Rotate the card by invoking the rotateBlock method on the CardComponent instance
  private rotateCard(cardID: string, isFacedUp: boolean): void {
    const imgElement = document.getElementById(cardID);
    if (imgElement && imgElement.parentElement && imgElement.parentElement.parentElement) {
      const blockInnerElement = imgElement.parentElement.parentElement;
      blockInnerElement.style.transform = isFacedUp ? "rotateY(180deg)" : "rotateY(0deg)";
    } else {
      console.error('Unable to find the block element to rotate');
    }
  }

  private handleComparisonResult(message: any): void {
    const { cardIDs, isEqual } = message;
    if (isEqual === true) {
      // console.log('The cards are equal:', cardIDs);
      const blockElements: HTMLElement[] = [];
      cardIDs.forEach((id: unknown) => {
        const cardElement = document.getElementById(id as string);
        if (cardElement) {
          const blockElement = cardElement.closest('.block');
          if (blockElement && !blockElements.includes(blockElement as HTMLElement)) {
            blockElements.push(blockElement as HTMLElement);
          }
        }
      });
  
      blockElements.forEach((blockElement) => {
        if (blockElement) {
          setTimeout(() =>{
            blockElement.style.transition = 'transform 0.5s, opacity 0.5s';
            blockElement.style.transform = 'scale(0.00001)';
            blockElement.style.opacity = '0';
          }, 1500)

        }
      });

      this.card.score++;

      this.sendMessage({
        action: 'updateScore',
        score: this.card.score
      });

    } else if ( isEqual === false ) {
      // console.log('The cards are not equal:', cardIDs);

      cardIDs.forEach((id: string) => {
        const cardElement = document.getElementById(id);
        if (cardElement) {
          setTimeout(() => {
            this.rotateCard(id, false); 
          }, 1500); 
        }
      });

      this.card.errors++;
      console.log(this.card.errors);
      this.sendMessage({
        action: 'updateErrors',
        error: this.card.errors,
      })
    }
  }

  handleScoreUpdate(score: number): void {
    this.card._multiplayerScore = score; // Setați multiplayerScore cu scorul primit
    this._multiplayerScore = this.card._multiplayerScore;
  }

  handleClientNameUpdate(name: string) {
    this._playerName = name;
  }

  handleErrorUpdate(error: number) {
    this.card._errorsMultiplayer = error;
    this._errorsMultiplayer = this.card._errorsMultiplayer;
  }
  
  
}



import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetCardPathService } from '../card/get-card-path.service';
import { CdTimerComponent, CdTimerModule } from 'angular-cd-timer';
import { WebSocketService } from '../game/multiplayer/websocket.service';
import { GameServiceService } from '../game/game-service.service';
import { shuffle } from 'lodash'; // Import the shuffle function from lodash library

export enum GameMode {
  CLASSIC = 'Classic',
  SHIFT = 'Shift',
  LEVEL = 'Level',
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, CdTimerModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  count: number;
  timerValue: number = 10;
  gameOver: boolean = false;


  ngOnInit() {
    this.generateCards(); // Apelează metoda generateCards la inițializarea componentei
  }

  ngAfterViewInit() {
    if (this.timerComponent) {
      this.timerComponent.startTime = this.timerValue;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['typeOfGame']) {
      console.log("typeOfGame updated in CardComponent:", changes['typeOfGame'].currentValue);
    }
  }

  // Cards array
  cards: any[] = [];
  selectedCardPaths: any;
  shuffled: any;

  // Card properties
  id: string = '';
  imgPath: string = '';
  rotated: boolean = false;
  size: string = '';
  isOriginal: boolean = true;
  cardName: string = '';
  cardsLocked: boolean = false;
  @Input() shiftCard: boolean = false;
  @Input() levelMode: boolean = false;

  // Game properties
  @Input() typeOfGame: string[] = ['animals']; 
  score: number = 0;
  matchedCardsCount: number = 0;
  level: number = 1;
  cardsPerLevel: number = 1;
  pairsPerLevel!: number;
  cardsNumber: number = 2;
  timerCompleted: boolean = false;
  errors: number = 0;
  noTimer: boolean = false;

  @Input() multiplayer: boolean = false;

  // Game mode
  gameMode!: GameMode;

  // Multiplayer
  savedCards: any[] = [];
  isShuffled!: boolean;
  isEqual!: boolean;
  _multiplayerScore!: number;
  _errorsMultiplayer!: number;
  
  get multiplayerScore(): number {
    return this.webSocketService.multiplayerScore;
  }

  get playerNameUpdate(): string {
    return this.webSocketService._playerName;
  }

  get errorsMultiplayer(): number{
    return this.webSocketService.errorsMultiplayer;
  }

  constructor(
    private cardPathService: GetCardPathService,
    private gameService: GameServiceService,
    private webSocketService: WebSocketService
  ) {
    this.count = 0;
    this.isShuffled = false;
    this.gameService = new GameServiceService();
    // console.log('Multiplayer variable:', this.multiplayer);
    this.isShuffled = false;
    // console.log("MULTIPLAYER SCORE: ", this.multiplayerScore);
    // console.log("PLAYER NAME: ", this.playerNameUpdate);

  }

  private generateCards(): void {
    console.log('Selected game type:', this.typeOfGame); // Adaugă acest console.log
  
    const cardPaths = this.cardPathService.getCardImagePath(this.typeOfGame);
    const cardsPerImage = 2; // Numărul de cărți dorite pentru fiecare imagine
  
    // Call getCards() to generate cards based on levelMode
    this.cards = this.getCards(
      cardPaths,
      cardsPerImage,
      this.cards,
      this.levelMode,
      this.multiplayer
    );
  }

  private extractCardName(path: string): string {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    const cardName = fileName.split('.')[0];
    return cardName;
  }

  public rotateBlock(card: any) {
    if (card.rotated === false && this.cardsLocked === false) {
      card.rotated = true;

      const flipped = this.cards.filter((c) => c.rotated);
      if (flipped.length === 2) {
        this.checkMatch(flipped);
        this.cardsLocked = true;
      }
    }

    //Send a request to backend to rotate the card to all clients.
    if (this.multiplayer === true) {
      const rotationData = {
        action: 'rotateCard',
        blockClass: 'block',
        isFacedUp: card.rotated,
        cardID: card.id,
      };

      this.webSocketService.sendMessage(rotationData);
    }
    // console.log('Card rotated from Card Component rotateBlock() function!');
  }

  handleClick(card: any): void {
    this.rotateBlock(card);
  }

  handleTimerFinish() {
    if (this.levelMode) {
      this.timerCompleted = true;
      if (this.timerComponent) {
        this.timerComponent.reset();
      }
    }
  }

  @ViewChild('basicTimer', { static: false }) timerComponent!: CdTimerComponent;

  refreshLevelModePage(): void {
    this.score = 0;
    this.level = 1;
    this.timerCompleted = false;

    // Reset the timer if the component reference exists
    if (this.timerComponent) {
      this.timerComponent.startTime = this.timerValue;
      this.timerComponent.start();
    }

    this.cards = [];
    this.generateCards();
  }

  generateClassicShiftMode(): void{
    if(this.levelMode === true){
      return;
    }else{
      this.cards = [];
      this.generateCards();
      this.gameOver = false;
      this.score = 0;
      this.errors = 0;
    }
  }

  refreshClassicShiftMode(): void {
    if(this.levelMode === true){
      return;
    }else if(this.shiftCard === false && this.matchedCardsCount * 2 === this.cards.length){
        this.gameOver = true;
    }

  }

  checkMatch(flipped: any[]) {
    // Verificăm dacă cele două cărți întoarse sunt identice
    if (flipped[0].id === flipped[1].id) {
      this.score++;
      this.matchedCardsCount += 1; // Increment the count of matched cards by 2

      setTimeout(() => {
        flipped.forEach((card) => {
          card.rotated = false; // Reset the rotated property of matched cards
          card.hide = true;
          this.shiftCards();

          if(this.cards.length === 0){
            this.gameOver = true;
          }
          console.log(this.cards.length);
        });
      }, 1500);

      if(this.multiplayer === true){
        this.webSocketService.sendMessage({
          action: "compareCards",
          cardIDs: [flipped[0].id, flipped[1].id]
        });
      }


    } else {
      this.errors++;
      setTimeout(() => {
        flipped.forEach((card) => {
          card.rotated = false;
        });
      }, 1500);

      if(this.multiplayer === true){
        this.webSocketService.sendMessage({
          action: "compareCards",
          cardIDs: [flipped[0].id, flipped[1].id]
        });
      }

    }

    setTimeout(() => {
      this.cardsLocked = false;
    }, 1500);

    // Check if all cards have been matched
    if (
      this.matchedCardsCount === this.cards.length / 2 &&
      this.levelMode === true
    ) {
      this.startNextLevel();
    }
  }

  shiftCards() {
    if (this.shiftCard === true) {
      this.cards = this.cards.filter((card) => !card.hide);
      this.flashCards(350);
    }
  }

  flashCards(duration: number) {
    // Toggle the visibility of the cards by adding the CSS class
    this.cards.forEach((card) => (card.rotated = true));

    // After the specified duration, toggle the visibility back by removing the CSS class
    setTimeout(() => {
      this.cards.forEach((card) => (card.rotated = false));
    }, duration);
  }



  getCards(
    cardPaths: string[],
    cardsPerImage: number,
    cards: any[],
    levelMode: boolean,
    multiplayer: boolean // Add multiplayer as a parameter to the method
  ): any[] {
    const selectedPaths: string[] = [];
    if (multiplayer && !this.isShuffled) { // Only shuffle if not already shuffled
      if (!this.shuffled) {
        this.shuffled = true; // Marcheză că cărțile au fost amestecate
        const cardCounts = new Map<string, number>();
  
        for (let imgPath of cardPaths) {
          const cardName = this.extractCardName(imgPath);
  
          // Verifică dacă cartea originală a fost deja adăugată
          const count = cardCounts.get(cardName) || 0;
          const isOriginal = count === 0;
          const suffix = isOriginal ? 'original' : 'copy';
          const id = `${cardName}-${suffix}`;
  
          // Adaugă cartea originală sau copia în array
          cards.push({
            id: id,
            imgPath: imgPath,
            rotated: false,
            size: '',
            isOriginal: isOriginal,
            cardName: cardName,
            typeOfGame: this.typeOfGame,
          });
  
          // Actualizează numărul de apariții ale cărții
          cardCounts.set(cardName, count + 1);
  
          // Dacă este carte originală, adaugă și copia ei
          if (isOriginal) {
            const copyId = `${cardName}-copy`;
            cards.push({
              id: copyId,
              imgPath: imgPath,
              rotated: false,
              size: '',
              isOriginal: false,
              cardName: cardName,
              typeOfGame: this.typeOfGame,
            });
          }
        }
  
        // Amestecă array-ul de cărți
        this.shuffleArray(cards);
      }
    } else if (levelMode === false) {
      this.noTimer = false;
      // Generate cards based on the usual logic when levelMode is false
      while (cards.length < cardPaths.length * cardsPerImage) {
        const randomIndex = Math.floor(Math.random() * cardPaths.length);
        const imgPath = cardPaths[randomIndex];
        if (
          selectedPaths.filter((path) => path === imgPath).length <
          cardsPerImage
        ) {

          selectedPaths.push(imgPath);
          const cardName = this.extractCardName(imgPath);

          const suffix = 'original';
          const id = `${cardName}-${suffix}`;

          cards.push({
            id: id,
            imgPath: imgPath,
            rotated: false,
            size: '',
            isOriginal: true,
            cardName: cardName,
            typeOfGame: this.typeOfGame,
          });
        }
      }
    } else if (levelMode === true) {
      this.noTimer = true;
      // Define the number of pairs per level
      this.pairsPerLevel = this.cardsNumber + (this.level - 1);

      // Limit the number of pairs to the maximum number of available images
      // this.pairsPerLevel = Math.min(this.pairsPerLevel, cardPaths.length);

      // Initialize an array to store selected images
      const selectedImages: string[] = [];

      // Select unique images from cardPaths
      while (
        selectedImages.length < this.pairsPerLevel / 2 &&
        cards.length <= cardPaths.length * 2
      ) {
        // Generate a random index to select an image from cardPaths
        const randomIndex = Math.floor(Math.random() * cardPaths.length);
        const imgPath = cardPaths[randomIndex];

        // Check if the selected image has not been added before
        if (!selectedImages.includes(imgPath)) {
          selectedImages.push(imgPath);
        }
      }

      // Shuffle the selected images
      for (let i = selectedImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selectedImages[i], selectedImages[j]] = [
          selectedImages[j],
          selectedImages[i],
        ];
      }

      // Add the shuffled images to the cards array
      for (const imgPath of selectedImages) {
        const cardName = this.extractCardName(imgPath);
        const suffix = 'original';
        const id = `${cardName}-${suffix}`;

        // Add each image to the cards array based on the cardsPerImage variable
        for (let i = 0; i < cardsPerImage; i++) {
          cards.push({
            id: id,
            imgPath: imgPath,
            rotated: false,
            size: '',
            isOriginal: true,
            cardName: cardName,
            typeOfGame: this.typeOfGame,
          });
        }
      }

      // Shuffle the cards array to mix pairs randomly
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      console.log(cards);
    }

    console.log('Generated cards length: ', cards.length);
    return cards; // Return the generated cards array
  }

  // Function to shuffle an array - MULTIPLAYER MODE ONLY.
  shuffleArray(cards: any[]): void {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }
  // =====================================================

  startNextLevel() {
    if (this.cards.length === this.cardPathService.getCardImagePath(this.typeOfGame).length * 2) {
      this.timerCompleted = true;
      if (this.timerComponent) {
        this.timerComponent.stop();
      }
      this.cards = [];
    } else {
      this.level++;
      
      // Adaugă timp suplimentar în funcție de numărul de cărți
      const additionalTime = this.cardsNumber * 10; // De exemplu, 10 secunde per carte
      this.timerValue += additionalTime;
  
      // Scădere timp în funcție de fiecare eroare
      if (this.errors > 0) {
        const timePenaltyPerError = 5; // Scădere cu 5 secunde pentru fiecare eroare
        this.timerValue -= this.cardsNumber * timePenaltyPerError;
      }

      this.cardsNumber += 2;
      this.matchedCardsCount = 0;
      this.cards = [];
  
      setTimeout(() => {
        this.generateCards();
        if (this.timerComponent) {
          this.timerComponent.reset();
          this.timerComponent.start();
        }
      }, 500);
    }
  }
}

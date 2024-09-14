import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GetCardPathService {
  getCardImagePath(typeOfGame: string[]): string[] {
    let images: string[] = [];

    typeOfGame.forEach((game) => {
      switch (game) {
        case 'animals':
          images = images.concat([
            '../assets/animals/baby-lion.webp',
            '../assets/animals/cat.webp',
            '../assets/animals/fox.webp',
            '../assets/animals/dog.webp',
            '../assets/animals/peacock.webp',
            '../assets/animals/zebra.webp',
            '../assets/animals/antilope.jpeg',
            '../assets/animals/gorila.jpeg',
            '../assets/animals/frog.jpeg',
            '../assets/animals/duck.jpeg',
            // adaugă alte imagini aici în funcție de necesități
          ]);
          break;
        case 'flowers':
          images = images.concat([
            '../assets/flowers/carnation.jpeg',
            '../assets/flowers/daisy.jpeg',
            '../assets/flowers/hydrangea.jpeg',
            '../assets/flowers/lavender.jpeg',
            '../assets/flowers/lily.jpeg',
            '../assets/flowers/orchid.jpeg',
            '../assets/flowers/peony.jpeg',
            '../assets/flowers/rose.jpeg',
            '../assets/flowers/sunflower.jpeg',
            '../assets/flowers/tulip.jpeg',
            // adaugă alte imagini aici în funcție de necesități
          ]);
          break;
        case 'countryFlags':
          images = images.concat([
            '../assets/countryFlags/br.svg',
            '../assets/countryFlags/ca.svg',
            '../assets/countryFlags/ch.svg',
            '../assets/countryFlags/co.svg',
            '../assets/countryFlags/cz.svg',
            '../assets/countryFlags/de.svg',
            '../assets/countryFlags/dk.svg',
            // adaugă alte imagini aici în funcție de necesități
          ]);
          break;
        case 'fruits':
          images = images.concat([
            '../assets/fruits/apple.jpg',
            '../assets/fruits/banana.jpg',
            '../assets/fruits/cherry.jpg',
            '../assets/fruits/grapes.jpg',
            '../assets/fruits/kiwi.jpg',
            '../assets/fruits/mango.jpg',
            '../assets/fruits/orange.jpg',
            '../assets/fruits/pineapple.jpg',
            '../assets/fruits/strawberry.jpg',
            '../assets/fruits/watermelon.jpg',
            // adaugă alte imagini aici în funcție de necesități
          ]);
          break;
        default:
          // Dacă nu există un caz potrivit, nu adăugăm imagini suplimentare
          break;
      }
    });

    return images;
  }
}

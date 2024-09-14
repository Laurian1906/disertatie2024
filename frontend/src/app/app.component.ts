import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  NgbPaginationModule,
  NgbAlertModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from './card/card.component';
import { MenuComponent } from './menu/menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Adaugă această linie

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    RouterOutlet,
    NgbAlertModule,
    NgbPaginationModule,
    NgbNavModule,
    MenuComponent,
    RouterLink,
    RouterLinkActive,
    NgbModule
  ],
})
export class AppComponent {
  title = 'joc_activity_online';

  constructor(private router: Router, private route: ActivatedRoute) {}
}

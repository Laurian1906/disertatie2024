import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LevelModeComponent } from './level-mode.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'levelMode', component: LevelModeComponent }
      // Poți adăuga și alte rute specifice modulului aici, dacă este nevoie
    ])
  ]
})
export class LevelModeModule { }

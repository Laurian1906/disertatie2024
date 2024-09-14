import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShiftModeComponent } from './shift-mode.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'shiftMode', component: ShiftModeComponent }
      // Poți adăuga și alte rute specifice modulului aici, dacă este nevoie
    ])
  ]
})
export class ShiftModeModule { }

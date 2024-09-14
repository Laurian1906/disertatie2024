import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClassicModeComponent } from './classic-mode.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'clasicMode', component: ClassicModeComponent }
      // Poți adăuga și alte rute specifice modulului aici, dacă este nevoie
    ])
  ]
})
export class ClassicModeModule { }

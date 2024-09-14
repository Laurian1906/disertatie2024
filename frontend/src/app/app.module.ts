import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { singleplayerRoutes } from './game/singleplayer/singleplayer.routes';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(singleplayerRoutes) // Înregistrarea rutelor pentru meniu
  ],
  providers: []
})
export class AppModule { }

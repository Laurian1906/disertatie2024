import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { GameRulesComponent } from './game-rules/game-rules.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SingleplayerComponent } from './game/singleplayer/singleplayer.component';
import { MultiplayerComponent } from './game/multiplayer/multiplayer.component';
import { ClassicModeComponent } from './game/singleplayer/classic-mode/classic-mode.component';
import { ShiftModeComponent } from './game/singleplayer/shift-mode/shift-mode.component';
import { LevelModeComponent } from './game/singleplayer/level-mode/level-mode.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'game-rules', component: GameRulesComponent},
    {path: 'menu', component: MenuComponent},
    {path: 'singleplayer', component: SingleplayerComponent},
    {path: 'multiplayer', component: MultiplayerComponent},
    {path: 'classicMode', component: ClassicModeComponent},
    {path: 'shiftMode', component: ShiftModeComponent},
    {path: 'levelMode', component: LevelModeComponent},
    {path: '**', component: PageNotFoundComponent},
];

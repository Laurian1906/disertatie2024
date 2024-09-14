import { Routes } from "@angular/router";

export const singleplayerRoutes: Routes = [
    { 
        path: 'classicMode', 
        loadChildren: () => import('./classic-mode/classic-mode.module').then(m => m.ClassicModeModule)
    },
    { 
        path: 'shiftMode', 
        loadChildren: () => import('./shift-mode/shift-mode.module').then(m => m.ShiftModeModule)
    },
    { 
        path: 'levelMode', 
        loadChildren: () => import('./level-mode/level-mode.module').then(m => m.LevelModeModule)
    }
];

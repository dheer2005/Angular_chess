import { Routes } from '@angular/router';
import { ChessBoardComponent } from '../chess-board/chess-board.component';

export const routes: Routes = [
    { path: 'chessBoard', component: ChessBoardComponent },
    { path: '', redirectTo: 'chessBoard', pathMatch: 'full' }

];

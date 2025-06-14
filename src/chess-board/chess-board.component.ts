import { CommonModule, Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Chess, Square } from 'chess.js';
import { playersInfo } from '../Model/playersInfo.model';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.css'
})
export class ChessBoardComponent implements OnInit {
  chess = new Chess();
  board: any[][] = [];
  selectedSquare: Square | null = null;
  legalMoves: Square[] = [];
  gameStarted: boolean = false;
  user1: string = '';
  user2: string = '';
  whiteTime: number = 0;
  blackTime: number = 0;  
  intervalId: any = null;
  timer: any = 1;
  Info?: playersInfo;


  durations: any = {
    '1 min': 1,
    '5 min': 5,
    '10 min': 10,
    '20 min': 20,
  };

  

  originalOrder = (a: any, b: any): number => 0;

  ngOnInit() {
    this.updateBoard();
    // this.chess.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
  }

  

  startGame(form: NgForm){
    this.Info = {
      user1: this.user1,
      user2: this.user2
    }
    this.gameStarted = true;
    this.whiteTime = this.timer * 60;
    this.blackTime = this.timer * 60;
    this.startTimer();
    form.reset();
  }

  startTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId); 
    }

    this.intervalId = setInterval(() => {
      const turn = this.chess.turn();

      if (turn === 'w') {
        this.whiteTime--;
        if (this.whiteTime <= 0) {
          clearInterval(this.intervalId);
          alert(`Time's up! ${this.Info?.user1} wins.`);
          this.gameStarted = false;
          this.user1 = '';
          this.user2 = '';
          this.resetGame();
        }
      } else {
        this.blackTime--;
        if (this.blackTime <= 0) {
          clearInterval(this.intervalId);
          alert(`Time's up! ${this.Info?.user2} wins.`);
          this.gameStarted = false;
          this.user1 = '';
          this.user2 = '';
          this.resetGame();
        }
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }


  resetGame() {
    this.chess.reset();
    this.updateBoard();
    this.selectedSquare = null;
    this.legalMoves = [];
    this.gameStarted = false;
    this.user1 = '';
    this.user2 = '';
    this.whiteTime = 0;
    this.blackTime = 0;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  updateBoard() {
    const boardState = this.chess.board();
    this.board = boardState.map(row =>
      row.map(piece => piece ? piece.color + piece.type : '')
    );
  }

  onSquareClick(row: number, col: number) {
    const file = 'abcdefgh'[col];
    const rank = 8 - row;
    const square = `${file}${rank}` as Square;

    if (this.selectedSquare) {
      const isLegal = this.legalMoves.includes(square);
      if (isLegal) {
        const moveObj: any = { from: this.selectedSquare, to: square };
        const piece = this.chess.get(this.selectedSquare);

        if (piece?.type === 'p' && (square.endsWith('8') || square.endsWith('1'))) {
          moveObj.promotion = 'q';
        }

        this.chess.move(moveObj);
        this.updateBoard();

        if (this.chess.isGameOver()) {
          if (this.chess.isCheckmate()) {
            alert("Checkmate! " + (this.chess.turn() === 'w' ? `${this.Info?.user1}` : `${this.Info?.user2}`) + " wins.");
          } else if (this.chess.isDraw()) {
            alert("Draw!");
          }
        }
      }
      this.selectedSquare = null;
      this.legalMoves = [];
    } else {
      const piece = this.chess.get(square);
      if (piece && piece.color === this.chess.turn()) {
        this.selectedSquare = square;
        const moves = this.chess.moves({ square, verbose: true });
        this.legalMoves = moves.map(m => m.to as Square);
      }
    }
  }

  isLegalMove(row: number, col: number): boolean {
    const file = 'abcdefgh'[col];
    const rank = 8 - row;
    const square = `${file}${rank}`;
    return this.legalMoves.includes(square as Square);
  }

  getSquareColor(row: number, col: number): string {
    return (row + col) % 2 === 0 ? 'white' : 'black';
  }


  getPieceIconClass(piece: string): string {
    const map: { [key: string]: string } = {
      wp: 'fa-solid fa-chess-pawn text-white',
      wr: 'fa-solid fa-chess-rook text-white',
      wn: 'fa-solid fa-chess-knight text-white',
      wb: 'fa-solid fa-chess-bishop text-white',
      wq: 'fa-solid fa-chess-queen text-white',
      wk: 'fa-solid fa-chess-king text-white',
      bp: 'fa-solid fa-chess-pawn text-dark',
      br: 'fa-solid fa-chess-rook text-dark',
      bn: 'fa-solid fa-chess-knight text-dark',
      bb: 'fa-solid fa-chess-bishop text-dark',
      bq: 'fa-solid fa-chess-queen text-dark',
      bk: 'fa-solid fa-chess-king text-dark',
    };
    return map[piece] || '';
  }
}

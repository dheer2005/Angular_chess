import { CommonModule, Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chess, Square } from 'chess.js';

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
    console.log(this.chess.turn());
  }

  startGame(){
    this.gameStarted = true;
    this.whiteTime = this.timer * 60;
    this.blackTime = this.timer * 60;
    this.startTimer();
    console.log( "clicked");
    console.log("player1",this.user1);
    console.log("player2",this.user2);
    console.log("time: ", this.timer);
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
          alert(`Time's up! ${this.user1} wins.`);
          this.gameStarted = false;
          this.user1 = '';
          this.user2 = '';
        }
      } else {
        this.blackTime--;
        if (this.blackTime <= 0) {
          clearInterval(this.intervalId);
          alert(`Time's up! ${this.user2} wins.`);
          this.gameStarted = false;
          this.user1 = '';
          this.user2 = '';
        }
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  updateBoard() {
    const boardState = this.chess.board();
    console.log(boardState);
    this.board = boardState.map(row =>
      row.map(piece => piece ? piece.color + piece.type : '')
    );
    console.log('LegalMoves: ',this.legalMoves);
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
            alert("Checkmate! " + (this.chess.turn() === 'w' ? 'Black' : 'White') + " wins.");
          } else if (this.chess.isDraw()) {
            alert("Draw!");
          }
        }
      }
      this.selectedSquare = null;
      this.legalMoves = [];
    } else {
      const piece = this.chess.get(square);
      console.log('piece: ', piece);
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

  // getPieceSymbol(piece: string): string {
  //   const map: { [key: string]: string } = {
  //     wp: '♙', wr: '♖', wn: '♘', wb: '♗', wq: '♕', wk: '♔',
  //     bp: '♟', br: '♜', bn: '♞', bb: '♝', bq: '♛', bk: '♚'
  //   };
  //   return map[piece] || '';
  // }

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
  
  
  
  
  
  
  // chess = new Chess();
  // board: any[][] = [];
  // selectedSquare: string | null = null;

  // ngOnInit() {
  //   this.updateBoard();
  // }

  // updateBoard() {
  //   const boardState = this.chess.board();
  //   console.log(boardState);
  //   this.board = boardState.map((row:any) =>
  //     row.map((piece:any) => piece ? piece.color + piece.type : '')
  //   );
  //   console.log(this.board);
  // }

  // onSquareClick(row: number, col: number) {
  //   const file = 'abcdefgh'[col];
  //   const rank = 8 - row;
  //   const square = file + rank;

  //   if (this.selectedSquare) {
  //     const move = this.chess.move({ from: this.selectedSquare, to: square });
  //     if (move) {
  //       this.updateBoard();
  //     } else {
  //       alert('Invalid move!');
  //     }
  //     this.selectedSquare = null;
  //   } else {
  //     const piece = this.chess.get(square as Square);
  //     if (piece) {
  //       this.selectedSquare = square;
  //     }
  //   }
  // }

  // getSquareColor(row: number, col: number): string {
  //   return (row + col) % 2 === 0 ? 'white' : 'black';
  // }

  // getPieceSymbol(piece: string): string {
  //   const map: { [key: string]: string } = {
  //     wp: '♙', wr: '♖', wn: '♘', wb: '♗', wq: '♕', wk: '♔',
  //     bp: '♟', br: '♜', bn: '♞', bb: '♝', bq: '♛', bk: '♚'
  //   };
  //   return map[piece] || '';
  // }
}

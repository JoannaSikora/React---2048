import React, { Component } from 'react';
import './App.css';
import Row from './Row'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: null,
      score: 0,
      gameOver: false,
      message: null,
      rows: 4,
      columns: 4
    };

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  // Create board with two random coordinate numbers
  initBoard() {
    let board = [];
    for (let i = 0; i < this.state.rows; i++) {
      const row = [];
      for (let j = 0; j < this.state.columns; j++) {
        row.push(0);
      }
      board.push(row);
    }


    board = this.placeRandom(this.placeRandom(board));
    this.setState({board, score: 0, gameOver: false, message: null});
  }

  // Get all blanks from board
  getBlanks(board) {
    const blanks = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {blanks.push([i, j])}
      }
    }
    return blanks;
  }

  randomNumber() {
    const startingNumbers = [2048,1024];
    const randomNumber = startingNumbers[Math.floor(Math.random() * startingNumbers.length)];
    return randomNumber;
  }

  placeRandom(board) {
    const blanks = this.getBlanks(board);
    const randomCoordinate = blanks[Math.floor(Math.random() * blanks.length)];
    const randomNumber = this.randomNumber();
    board[randomCoordinate[0]][randomCoordinate[1]] = randomNumber;
    return board;
  }

  boardMoved(original, updated) {
    return (JSON.stringify(updated) !== JSON.stringify(original)) ? true : false;
  }

  move(direction) {
    if (!this.state.gameOver) {
      if (direction === 'up') {
        const movedUp = this.moveUp(this.state.board);

        if (this.boardMoved(this.state.board, movedUp.board)) {
          const upWithRandom = this.placeRandom(movedUp.board);

          if (this.checkForGameOver(upWithRandom)) {
            this.setState({board: upWithRandom, gameOver: true, message: 'Game over!'});
          } else {
            this.setState({board: upWithRandom, score: this.state.score += movedUp.score});
          }
        }
      } else if (direction === 'right') {
        const movedRight = this.moveRight(this.state.board);
        if (this.boardMoved(this.state.board, movedRight.board)) {
          const rightWithRandom = this.placeRandom(movedRight.board);

          if (this.checkForGameOver(rightWithRandom)) {
            this.setState({board: rightWithRandom, gameOver: true, message: 'Game over!'});
          } else {
            this.setState({board: rightWithRandom, score: this.state.score += movedRight.score});
          }
        }
      } else if (direction === 'down') {
        const movedDown = this.moveDown(this.state.board);
        if (this.boardMoved(this.state.board, movedDown.board)) {
          const downWithRandom = this.placeRandom(movedDown.board);

          if (this.checkForGameOver(downWithRandom)) {
            this.setState({board: downWithRandom, gameOver: true, message: 'Game over!'});
          } else {
            this.setState({board: downWithRandom, score: this.state.score += movedDown.score});
          }
        }
      } else if (direction === 'left') {
        const movedLeft = this.moveLeft(this.state.board);
        if (this.boardMoved(this.state.board, movedLeft.board)) {
          const leftWithRandom = this.placeRandom(movedLeft.board);

          if (this.checkForGameOver(leftWithRandom)) {
            this.setState({board: leftWithRandom, gameOver: true, message: 'Game over!'});
          } else {
            this.setState({board: leftWithRandom, score: this.state.score += movedLeft.score});
          }
        }
      }
    } else {
      this.setState({message: 'Game over. Please start a new game.'});
    }
  }

  moveUp(currentBoard) {
    //rotation needed for moves up and down to deal with the arrays
    let rotatedRight = this.rotateRight(currentBoard);
    let board = [];
    let score = 0;

    // Shift all numbers to the right
    for (let i = 0; i < rotatedRight.length; i++) {
      let row = [];
      for (let j = 0; j < rotatedRight[i].length; j++) {
        let current = rotatedRight[i][j];
//if none add it at the front of the array, if a number push it at the end of the array
        (current === 0) ? row.unshift(current) : row.push(current);
      }
      board.push(row);
    }

    // Combine numbers and shift to right
    for (let i = 0; i < board.length; i++) {

      for (let j = board[i].length - 1; j >= 0; j--) {
        //check if two neighboars are the same
        if (board[i][j] > 0 && board[i][j] === board[i][j - 1]) {
        //substract numbers
          board[i][j] = board[i][j] / 2;
          //reset the number
          board[i][j - 1] = 0;
          //add to the score
          score += board[i][j];
        }
//move the other cells to the right
        else if (board[i][j] === 0 && board[i][j - 1] > 0) {
          board[i][j] = board[i][j - 1];
          board[i][j - 1] = 0;
        }
      }
    }

    // Rotate board back upright
    board = this.rotateLeft(board);
    return {board, score};
  }

  moveRight(currentBoard) {
    let board = [];
    let score = 0;

    // Shift all numbers to the right
    for (let i = 0; i < currentBoard.length; i++) {
      let row = [];
      for (let j = 0; j < currentBoard[i].length; j++) {
        let current = currentBoard[i][j];
        (current === 0) ? row.unshift(current) : row.push(current);
      }
      board.push(row);
    }

    // Combine numbers and shift to right
    for (let i = 0; i < board.length; i++) {
      for (let j = board[i].length - 1; j >= 0; j--) {
        if (board[i][j] > 0 && board[i][j] === board[i][j - 1]) {
          board[i][j] = board[i][j] / 2;
          board[i][j - 1] = 0;
          score += board[i][j];
        } else if (board[i][j] === 0 && board[i][j - 1] > 0) {
          board[i][j] = board[i][j - 1];
          board[i][j - 1] = 0;
        }
      }
    }

    return {board, score};
  }



  moveDown(currentBoard) {
    let rotatedRight = this.rotateRight(currentBoard);
    let board = [];
    let score = 0;

    // Shift all numbers to the left
    for (let i = 0; i < rotatedRight.length; i++) {
      let row = [];
      for (let j = rotatedRight[i].length - 1; j >= 0; j--) {
        let current = rotatedRight[i][j];
        (current === 0) ? row.push(current) : row.unshift(current);
      }
      board.push(row);
    }

    // Combine numbers and shift to left
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] > 0 && board[i][j] === board[i][j + 1]) {
          board[i][j] = board[i][j] / 2;
          board[i][j + 1] = 0;
          score += board[i][j];
        } else if (board[i][j] === 0 && board[i][j + 1] > 0) {
          board[i][j] = board[i][j + 1];
          board[i][j + 1] = 0;
        }
      }
    }

    // Rotate board back upright
    board = this.rotateLeft(board);

    return {board, score};
  }

  moveLeft(currentBoard) {
    let board = [];
    let score = 0;

    // Shift all numbers to the left
    for (let i = 0; i < currentBoard.length; i++) {
      let row = [];
      for (let j = currentBoard[i].length - 1; j >= 0; j--) {
        let current = currentBoard[i][j];
        (current === 0) ? row.push(current) : row.unshift(current);
      }
      board.push(row);
    }

    // Combine numbers and shift to left
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] > 0 && board[i][j] === board[i][j + 1]) {
          board[i][j] = board[i][j] / 2;
          board[i][j + 1] = 0;
          score += board[i][j];
        } else if (board[i][j] === 0 && board[i][j + 1] > 0) {
          board[i][j] = board[i][j + 1];
          board[i][j + 1] = 0;
        }
      }
    }

    return {board, score};
  }

  rotateRight(currentBoard) {
    let result = [];

    for (let i = 0; i < currentBoard.length; i++) {
      let row = [];
      for (let j = currentBoard.length - 1; j >= 0; j--) {
        row.push(currentBoard[j][i]);
      }
      result.push(row);
    }

    return result;
  }

  rotateLeft(currentBoard) {
    let result = [];

    for (let i = currentBoard.length - 1; i >= 0; i--) {
      let row = [];
      for (let j = currentBoard.length - 1; j >= 0; j--) {
        row.unshift(currentBoard[j][i]);
      }
      result.push(row);
    }

    return result;
  }

  checkForGameOver(board) {
  }


  componentWillMount() {
    this.initBoard();
    window.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {

    if (e.keyCode === 38) {
      this.move('up');
    }
    if (e.keyCode === 39) {
      this.move('right');
    }
    if (e.keyCode === 40) {
      this.move('down');
    }
    if (e.keyCode === 37) {
      this.move('left');
    }
  }

  render() {
    return (
      <div>
      <h1>2048</h1>
        <div className="button" onClick={()=>{this.initBoard()}}>New Game</div>
        <div className="score">Score: {this.state.score}</div>

        <table>
        <tbody>
          {this.state.board.map((row, i) => (<Row key={i} row={row} />))}
          </tbody>
        </table>

        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default App;

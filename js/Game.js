import {Cell} from './Cell.js';
import {UI} from './UI.js';

class Game extends UI{

    #config = {
        easy: {
            rows: 8,
            cols: 8,
            mines: 10
        },
        midium: {
            rows: 16,
            cols: 16,
            mines: 40
        },
        expert: {
            rows: 16,
            cols: 30,
            mines: 99
        }
    }

    #numberOfRows = 0;
    #numbersOfCols = 0;
    #numberOfMines = 0;

    #cells =[];
    #board = null;
    #cellsElements = null;

    #newGame(
        rows = this.#config.easy.rows,
        cols = this.#config.easy.cols,
        mines = this.#config.easy.mines
    ){
        this.#numberOfRows = rows;
        this.#numbersOfCols = cols;
        this.#numberOfMines = mines;

        this.#setStyle();
        this.#generateCalls();
        this.#renderBoard();

        this.#cellsElements = this.getElements(this.UiSelectors.cell);
        this.#addCellsEventListeners();
    }

    #addCellsEventListeners(){
        this.#cellsElements.forEach(element =>{
            element.addEventListener('click', this.#handleCellClick);
            element.addEventListener('contextmenu', this.#handleCellContextMenu);
        })
    }

    #generateCalls(){
        for( let row = 0; row < this.#numberOfRows; row++){
            this.#cells[row] = []
            for(let col = 0; col < this.#numbersOfCols; col++){
                this.#cells[row].push(new Cell(col, row))
            }
        }
    }

    #renderBoard(){
            this.#cells.flat().forEach(cell =>{
                this.#board.insertAdjacentHTML('beforeend', cell.createElement());
                cell.element = cell.getElement(cell.selector);
            })
    }

    #handleCellClick = (e) => {
        const target = e.target;
        const rowIndex = parseInt(target.getAttribute('data-y',10));
        const colIndex = parseInt(target.getAttribute('data-x',10));
        this.#cells[rowIndex][colIndex].revealCell();
    }

    #handleCellContextMenu= (e)=>{
        e.preventDefault();
        const target = e.target;
        const rowIndex = parseInt(target.getAttribute('data-y',10));
        const colIndex = parseInt(target.getAttribute('data-x',10));

        const cell =  this.#cells[rowIndex][colIndex];

         if(cell.isReveal) return;

        cell.toggleFlag()
    }

    #setStyle(){
        document.documentElement.style.setProperty('--cells-in-row',this.#numbersOfCols)
    }

    #handleElements(){
        this.#board = this.getElement(this.UiSelectors.board)
    }

    initializeGame(){
        this.#handleElements()
        this.#newGame()
    }
}

document.addEventListener('DOMContentLoaded', function(){
    const game = new Game();
    game.initializeGame();
})
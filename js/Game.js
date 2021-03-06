import {Cell} from './Cell.js';
import {UI} from './UI.js';
import {Counter} from './Counter.js';
import {Timer} from './Timer.js';
import {ResetButton} from './ResetButton.js';
import {Modal} from './Modal.js';

class Game extends UI{

    #config = {
        easy: {
            rows: 8,
            cols: 8,
            mines: 10
        },
        normal: {
            rows: 16,
            cols: 16,
            mines: 40
        },
        expert: {
            rows: 16,
            cols: 30,
            mines: 99
        }, 
        custom: {
            rows: null,
            cols: null,
            mines: null
        }
    }

    #isGameFinished = false;
    #numberOfRows = 0;
    #numbersOfCols = 0;
    #numberOfMines = 0;

    #counter = new Counter();
    #timer = new Timer();
    #modal = new Modal();

    #cellsElements = null;
    #cells =[];
    #cellsToReveal = 0;
    #revealCells = 0;
    #board = null;


    #buttons = {
        modal: null,
        easy: null,
        normal: null,
        expert: null,
        custom: null,
        buttonCustom: null,
        reset: new ResetButton()
    }

    #customInputs = {
        rows: null,
        cols: null,
        mines: null,
        customClose: null
    }


    #newGame(
        rows = this.#config.easy.rows,
        cols = this.#config.easy.cols,
        mines = this.#config.easy.mines
    ){
        this.#numberOfRows = rows;
        this.#numbersOfCols = cols;
        this.#numberOfMines = mines;

        this.#cellsToReveal = this.#numberOfRows * this.#numbersOfCols -  this.#numberOfMines;


        this.#counter.setValue(this.#numberOfMines)
        this.#timer.resetTimer()
        this.#setStyle();
        this.#generateCalls();
        this.#renderBoard();
        this.#placeMinesInCells();

        this.#cellsElements = this.getElements(this.UiSelectors.cell);
        this.#buttons.reset.changeEmotion('neutral');
        this.#isGameFinished = false;
        this.#revealCells = 0;
        this.#addCellsEventListeners();
    }

    #endGame(isWin){
        this.#isGameFinished = true;
        this.#timer.stopTimer();
        this.#modal.buttonText = "Close";


        if(!isWin){
            this.#revealMines();
            this.#modal.infoText ='You lost, try again!';
            this.#buttons.reset.changeEmotion('negative');
            this.#modal.setText();
            this.#modal.toggleModal(this.#modal.element);
            return;
        }

        this.#modal.infoText = this.#timer.numberOfSeconds < this.#timer.maxNumberOfSeconds ? `You win, it take you ${this.#timer.numberOfSeconds} secondts`: 'You won, congratulations';
        this.#buttons.reset.changeEmotion('positive');
        this.#modal.setText();
        this.#modal.toggleModal(this.#modal.element);

    }

    #addCellsEventListeners(){
        this.#cellsElements.forEach(element =>{
            element.addEventListener('click', this.#handleCellClick);
            element.addEventListener('contextmenu', this.#handleCellContextMenu);
        })
    }

    #removeCellsEventListeners(){
        this.#cellsElements.forEach(element =>{
            element.removeEventListener('click', this.#handleCellClick);
            element.removeEventListener('contextmenu', this.#handleCellContextMenu);
        })
    }

    #addButtonsEventListeners(){

        this.#buttons.modal.addEventListener('click', () => this.#modal.toggleModal(this.#modal.element));

        this.#buttons.easy.addEventListener('click', () =>{
            this.#handleNewGameClick(
                this.#config.easy.rows,
                this.#config.easy.cols,
                this.#config.easy.mines
            );
        }) 

        this.#buttons.normal.addEventListener('click', () =>{
            this.#handleNewGameClick(
                this.#config.normal.rows,
                this.#config.normal.cols,
                this.#config.normal.mines
            );
        }) 

        this.#buttons.expert.addEventListener('click', () =>{
            this.#handleNewGameClick(
                this.#config.expert.rows,
                this.#config.expert.cols,
                this.#config.expert.mines
            );
        }) 

        this.#buttons.custom.addEventListener('click', () =>{
            this.#modal.toggleModal(this.#modal.modalCustom)
        }) 

        this.#buttons.buttonCustom.addEventListener('click', (e) =>{
            e.preventDefault();
            this.#getCustomOptions()

            if(!this.#checkCustomConfig()){
                this.#modal.toggleModal(this.#modal.modalError)
                setTimeout(()=>{
                    this.#modal.toggleModal(this.#modal.modalError)
                }, 2500)
                return;
            }

            this.#handleNewGameClick(
                this.#config.custom.rows,
                this.#config.custom.cols,
                this.#config.custom.mines
            );

            this.#modal.toggleModal(this.#modal.modalCustom)
        })

        this.#customInputs.customClose.addEventListener('click', () => {
            this.#modal.toggleModal(this.#modal.modalCustom);
        })

        this.#buttons.reset.element.addEventListener('click', () => {
            this.#handleNewGameClick();
        }) 
    }

    #handleNewGameClick(
        rows= this.#numberOfRows, 
        cols = this.#numbersOfCols, 
        mines = this.#numberOfMines
    ){
        this.#removeCellsEventListeners()
        this.#newGame(rows, cols, mines)
    }

    #generateCalls(){
        this.#cells.length = 0;
        for( let row = 0; row < this.#numberOfRows; row++){
            this.#cells[row] = []
            for(let col = 0; col < this.#numbersOfCols; col++){
                this.#cells[row].push(new Cell(col, row))
            }
        }
    }

    #renderBoard(){
        while(this.#board.firstChild){
            this.#board.removeChild(this.#board.lastChild)
        }
        this.#cells.flat().forEach(cell =>{
            this.#board.insertAdjacentHTML('beforeend', cell.createElement());
            cell.element = cell.getElement(cell.selector);
        })
    }

    #placeMinesInCells(){
        let minesToPlace = this.#numberOfMines;

        while(minesToPlace){
            const rowIndex = this.#getRandomInteager(0 , this.#numberOfRows - 1)
            const colIndex = this.#getRandomInteager(0 , this.#numbersOfCols - 1);

            const cell = this.#cells[rowIndex][colIndex];

            const hasCellMine = cell.isMine;

            if(!hasCellMine){
                cell.addMine();
                minesToPlace--;
            }
        }
    }

    #getCustomOptions(){
        this.#customInputs.rows = this.getElement(this.UiSelectors.customRows);
        this.#customInputs.cols = this.getElement(this.UiSelectors.customCols);
        this.#customInputs.mines = this.getElement(this.UiSelectors.customMines);

        this.#config.custom.rows = this.#customInputs.rows.value;
        this.#config.custom.cols = this.#customInputs.cols.value;
        this.#config.custom.mines = this.#customInputs.mines.value;
    }

    #checkCustomConfig(){
        if(
            this.#config.custom.rows < 8 || 
            this.#config.custom.cols < 8 ||  
            this.#config.custom.mines >= this.#config.custom.cols *  this.#config.custom.rows || 
            this.#config.custom.mines < 0)
        {
            return false;
        }

        return true;
    }

    #handleCellClick = (e) => {
        const target = e.target;
        const rowIndex = parseInt(target.getAttribute('data-y',10));
        const colIndex = parseInt(target.getAttribute('data-x',10));
        const cell = this.#cells[rowIndex][colIndex];

        this.#clickCell(cell);
    }

    #handleCellContextMenu= (e)=>{
        e.preventDefault();
        const target = e.target;
        const rowIndex = parseInt(target.getAttribute('data-y',10));
        const colIndex = parseInt(target.getAttribute('data-x',10));

        const cell =  this.#cells[rowIndex][colIndex];

        if(cell.isReveal || this.#isGameFinished) return;

        if(cell.isFlagged){
            this.#counter.increment();
            cell.toggleFlag()
            return;
        }
         
        if(!!this.#counter.value){
            this.#counter.decrement();
            cell.toggleFlag()
        }

    }

    #clickCell(cell){
        if(this.#isGameFinished || cell.isFlagged) return;

        if(cell.isMine){
            this.#endGame(false);
            return;
        }

        this.#setCellValue(cell);

        if(this.#revealCells === this.#cellsToReveal && !this.#isGameFinished){
            this.#endGame(true);
        }
    }

    #revealMines(){
        this.#cells.flat().filter(cell => cell.isMine).forEach( cell =>{
            cell.revealCell()
        })
    }

    #setCellValue(cell){
        let minesCount = 0;
        for(let rowIndex = Math.max(cell.y -1, 0); rowIndex <= Math.min(cell.y + 1, this.#numberOfRows - 1); rowIndex++){
            for(let colIndex = Math.max(cell.x - 1, 0); colIndex <= Math.min(cell.x + 1, this.#numbersOfCols -1 ); colIndex++){
                if(this.#cells[rowIndex][colIndex].isMine){
                    minesCount++;
                }
            }
        }
        cell.value = minesCount;
        cell.revealCell();
        this.#revealCells++;

        if(!cell.value){
            for(let rowIndex = Math.max(cell.y -1, 0); rowIndex <= Math.min(cell.y + 1, this.#numberOfRows - 1); rowIndex++){
                for(let colIndex = Math.max(cell.x - 1, 0); colIndex <= Math.min(cell.x + 1, this.#numbersOfCols -1 ); colIndex++){

                    const cell = this.#cells[rowIndex][colIndex];

                    if(!cell.isReveal){
                        this.#clickCell(cell);
                    }
                }
            }
        }
    }

    #setStyle(){
        document.documentElement.style.setProperty('--cells-in-row',this.#numbersOfCols)
    }

    #getRandomInteager(min , max) {
        return Math.floor((Math.random() * (max - min +1)) + min )
    }

    #handleElements(){
        this.#board = this.getElement(this.UiSelectors.board);
        this.#buttons.modal = this.getElement(this.UiSelectors.modalButton);

        this.#buttons.easy = this.getElement(this.UiSelectors.easyButton);
        this.#buttons.normal = this.getElement(this.UiSelectors.normalButton);
        this.#buttons.expert = this.getElement(this.UiSelectors.expertButton);

        this.#buttons.custom = this.getElement(this.UiSelectors.customButton);
        this.#buttons.buttonCustom = this.getElement(this.UiSelectors.modalCustomButton);
        this.#customInputs.customClose = this.getElement(this.UiSelectors.customClose);
    }

    initializeGame(){
        this.#handleElements();
        this.#timer.init();
        this.#counter.init();
        this.#newGame();
        this.#addButtonsEventListeners();
    }
}

document.addEventListener('DOMContentLoaded', function(){
    const game = new Game();
    game.initializeGame();
})
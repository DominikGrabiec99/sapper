export class UI{
    UiSelectors = {
        board: '[data-board]',
        cell: '[data-cell]',
        counter: '[data-counter',
        timer: '[data-timer]',
        resetButton: '[data-button-reset]',
        easyButton: '[data-button-easy]',
        normalButton: '[data-button-normal]',
        expertButton: '[data-button-expert]',
        customButton: '[data-button-custom]',
        modalCustom: '[data-modal-custom]',
        modalCustomButton: '[data-modal-custom-button]',
        customRows: '[data-rows-custom]',
        customCols: '[data-cols-custom]',
        customMines: '[data-mines-custom]',
        customError: '[data-error-custom]',
        customClose: '[data-modal-custom-close]',
        modal: '[data-modal]',
        modalHeader: '[data-modal-header]',
        modalButton: '[data-modal-button]'
    }

    getElement(selector){
        return document.querySelector(selector)
    }

    getElements ( selector){
        return document.querySelectorAll(selector)
    }
}
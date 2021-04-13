import {UI} from './UI.js';

export class Modal extends UI{
    buttonText = '';
    infoText = '';
    element = this.getElement(this.UiSelectors.modal);
    button = this.getElement(this.UiSelectors.modalButton);
    header = this.getElement(this.UiSelectors.modalHeader);

    modalCustom = this.getElement(this.UiSelectors.modalCustom);
    modalCustomButton = this.getElement(this.UiSelectors.modalCustomButton);
    modalError = this.getElement(this.UiSelectors.customError);

    toggleModal = (modal) =>{
        modal.classList.toggle('hide');
    }

    setText(){
        this.header.textContent = this.infoText;
        this.button.textContent = this.buttonText;
    }
}
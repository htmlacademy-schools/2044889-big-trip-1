import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
  _data = {};

  updateData = (update, dataUpdating) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    if(dataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement = () => {
    const sElement = this.element;
    const parent = sElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, sElement);

    this.restoreHandlers();
  }

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}

import TripEventItemView from '../view/trip-events-item-view';
import EventEditView from '../view/edit-event-item-view';
import { render, RenderPosition, replace, remove } from '../utils/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointsListElement = null;
  #changeData = null;
  #changeMode = null;

  #pointItemComponent = null;
  #pointEditComponent = null;

  #tripPoint = null;
  #mode = Mode.DEFAULT;

  constructor(pointsListElement, chageData, changeMode) {
    this.#pointsListElement = pointsListElement;
    this.#changeData = chageData;
    this.#changeMode = changeMode;
  }

  init = (tripPoint) => {
    this.#tripPoint = tripPoint;

    const prevPointItem = this.#pointItemComponent;
    const prevPointEdit = this.#pointEditComponent;

    this.#pointItemComponent = new TripEventItemView(tripPoint);
    this.#pointEditComponent = new EventEditView(tripPoint);

    this.#pointItemComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointItemComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#pointEditComponent.setRollupClickHandler(this.#handleRollupClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (prevPointItem === null || prevPointEdit === null) {
      render(this.#pointsListElement, this.#pointItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointItemComponent, prevPointItem);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEdit);
    }

    remove(prevPointItem);
    remove(prevPointEdit);
  }

  destroy = () => {
    remove(this.#pointItemComponent);
    remove(this.#pointEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#changeFormToItem();
    }
  }

  #changeItemToForm = () => {
    replace(this.#pointEditComponent, this.#pointItemComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #changeFormToItem = () => {
    replace(this.#pointItemComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#changeFormToItem();
    }
  }

  #handleEditClick = () => {
    this.#changeItemToForm();
  }

  #handleRollupClick = () => {
    this.#changeFormToItem();
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#tripPoint, isFavorite: !this.#tripPoint.isFavorite});
  }

  #handleFormSubmit = (point) => {
    this.#changeData(point);
    this.#changeFormToItem();
  }
}
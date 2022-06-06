import TripEventItemView from '../view/trip-events-item-view';
import EventEditView from '../view/edit-event-item-view';
import { render, RenderPosition, replace, remove } from '../utils/render';
import { UserAction, UpdateType } from '../utils/const';
import {isDatesEqual} from '../utils/favorite';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING'
};

export default class PointPresenter {
  #pointsListElement = null;
  #changeData = null;
  #changeMode = null;

  #pointItemComponent = null;
  #pointEditComponent = null;

  #tripPoint = null;
  #mode = Mode.DEFAULT;

  #ofOffers = null;
  #destinations = null;

  constructor(pointsListElement, chageData, changeMode, destinations, ofOffers) {
    this.#pointsListElement = pointsListElement;
    this.#changeData = chageData;
    this.#changeMode = changeMode;
    this.#ofOffers = ofOffers;
    this.#destinations = destinations;
  }

  init = (tripPoint) => {
    this.#tripPoint = tripPoint;

    const prevPointItem = this.#pointItemComponent;
    const prevPointEdit = this.#pointEditComponent;

    this.#pointItemComponent = new TripEventItemView(tripPoint);
    this.#pointEditComponent = new EventEditView(tripPoint, this.#destinations, this.#ofOffers);

    this.#pointItemComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointItemComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#pointEditComponent.setRollupClickHandler(this.#handleRollupClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevPointItem === null || prevPointEdit === null) {
      render(this.#pointsListElement, this.#pointItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointItemComponent, prevPointItem);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEdit);
      this.#mode = Mode.DEFAULT;
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
      this.#pointEditComponent.reset(this.#tripPoint);
      this.#changeFormToItem();
    }
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#pointItemComponent.shake(resetFormState);
        this.#pointEditComponent.shake(resetFormState);
        break;
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
      this.#pointEditComponent.reset(this.#tripPoint);
      this.#changeFormToItem();
    }
  }

  #handleEditClick = () => {
    this.#changeItemToForm();
  }

  #handleRollupClick = () => {
    this.#pointEditComponent.reset(this.#tripPoint);
    this.#changeFormToItem();
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      {...this.#tripPoint, isFavorite: !this.#tripPoint.isFavorite}
    );
  }

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
      !isDatesEqual(this.#tripPoint.dateFrom, update.dateFrom) ||
      !isDatesEqual(this.#tripPoint.dateTo, update.dateTo) ||
      (this.#tripPoint.basePrice !== update.basePrice);

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  }

  #handleDeleteClick = (task) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      task,
    );
  }
}

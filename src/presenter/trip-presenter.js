import { render, RenderPosition } from '../utils/render';
import EventsListView from '../view/event-list-view';
import NoTripsView from '../view/no-trips-view';
import TripSortView from '../view/trip-sort-view';
import PointPresenter from './point-presenter';
import { SortType, UpdateType, UserAction } from '../utils/const';
import { sortTaskByDay, sortTaskByDuration, sortTaskByPrice} from '../utils/point';

export default class TripPresenter {
  #mainElement = null;
  #tripPointsElement = null;

  #pointsModel = null;

  #noTripsComponent = new NoTripsView();
  #tripPointsListComponent = new EventsListView();
  #sortComponent = null;

  #pointPresenter = new Map();

  #currentSortType = SortType.SORT_DAY;

  constructor(mainElement, pointsModel) {
    this.#mainElement = mainElement;
    this.#tripPointsElement = this.#mainElement.querySelector('.trip-events');

    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.SORT_DAY:
        return [...this.#pointsModel.points].sort(sortTaskByDay);
      case SortType.SORT_TIME:
        return [...this.#pointsModel.points].sort(sortTaskByDuration);
      case SortType.SORT_PRICE:
        return [...this.#pointsModel.points].sort(sortTaskByPrice);
    }
    return this.#pointsModel.points;
  }

  init = () => {
    this.#renderMain();
  }

  #renderNoTasks = () => {
    render(this.#tripPointsElement, this.#noTripsComponent, RenderPosition.BEFOREEND);
  }

  #renderTripPointsListElement = () => {
    render(this.#tripPointsElement, this.#tripPointsListComponent, RenderPosition.BEFOREEND);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearMain();
        this.#renderMain();
        break;
      case UpdateType.MAJOR:
        this.#clearMain({ resetRenderedTaskCount: true, resetSortType: true });
        this.#renderMain();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderTripPointsList(this.points);
    this.#clearMain({ resetRenderedTaskCount: true });
    this.#renderMain();
  }

  #renderSort = () => {
    this.#sortComponent = new TripSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#tripPointsElement, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderTripPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripPointsListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderTripPointsList = (points) => {
    points.forEach((point) => this.#renderTripPoint(point));
  }

  #clearMain = ({ resetSortType = false } = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    TripPresenter.remove(this.#sortComponent);
    TripPresenter.remove(this.#noTripsComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.SORT_DAY;
    }
  }

  #renderMain = () => {
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoTasks();
      return;
    }

    this.#renderSort();
    this.#renderTripPointsListElement();
    this.#renderTripPointsList(points);
  }

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }
}

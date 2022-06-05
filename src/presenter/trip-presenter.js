import TripSortView from '../view/trip-sort-view.js';
import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import EventsListView from '../view/event-list-view.js';
import NoTripsView from '../view/no-trips-view.js';
import {render, RenderPosition, remove} from '../utils/render';
import {filter} from '../utils/filter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../utils/const.js';
import {sortTaskByDay, sortTaskByDuration, sortTaskByPrice} from '../utils/point.js';
import LoadingView from '../view/loading-view.js';

export default class TripPresenter {
  #mainContainer = null;
  #tableContainer = null;

  #pointsModel = null;
  #filterModel = null;

  #eventListComponent = new EventsListView();
  #noPointComponent = null;
  #sortComponent = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #apiService = null;
  #loadingComponent = new LoadingView();
  #isLoading = null;
  #offers = null;
  #destinations = null;

  #currentSortType = SortType.SORT_DAY;
  #filterType = FilterType.EVERYTHING;

  constructor(mainContainer, pointsModel, filterModel, apiService) {
    this.#mainContainer = mainContainer;
    this.#tableContainer = this.#mainContainer.querySelector('.trip-events');

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#apiService = apiService;

    this.#pointNewPresenter = new PointNewPresenter(this.#eventListComponent, this.#handleViewAction);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.SORT_DAY:
        return filteredPoints.sort(sortTaskByDay);
      case SortType.SORT_TIME:
        return filteredPoints.sort(sortTaskByDuration);
      case SortType.SORT_PRICE:
        return filteredPoints.sort(sortTaskByPrice);
    }
    return filteredPoints;
  }

  init = async () => {
    try {
      this.#destinations = await this.#apiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    try {
      this.#offers = await this.#apiService.offers;
    } catch(err) {
      this.#offers = [];
    }
  }

  destroy = () => {
    this.#clearTable(true);
    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  createPoint = (callback) => {
    this.#clearTable();
    this.#renderTable();

    this.#pointNewPresenter.init(callback, this.#offers, this.#destinations);
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
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
        this.#clearTable();
        this.#renderTable();
        break;
      case UpdateType.MAJOR:
        this.#clearTable(true);
        this.#renderTable();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTable();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTable();
    this.#renderTable();
  }

  #renderSort = () => {
    this.#sortComponent = new TripSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#tableContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderTripPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#eventListComponent, this.#handleViewAction, this.#handleModeChange, this.#offers, this.#destinations);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderLoading = () => {
    render(this.#tableContainer, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderTripPoints = (points) => {
    points.forEach((point) => this.#renderTripPoint(point));
  }

  #renderNoPoints = () => {
    this.#noPointComponent = new NoTripsView(this.#filterType);
    render(this.#eventListComponent, this.#noPointComponent, RenderPosition.AFTERBEGIN);
  }

  #clearTable = (resetSortType = false) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#eventListComponent);
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.SORT_DAY;
    }
  }

  #renderTable = () => {
    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }
    render(this.#tableContainer, this.#eventListComponent, RenderPosition.BEFOREEND);
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderTripPoints(points);
  }
}

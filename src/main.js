import { render, RenderPosition } from './utils/render.js';
import TripFiltersView from './view/trip-filters-view.js';
import TripTabsView from './view/trip-tabs-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import { eventTypes } from './mock/event-types.js';
import PointsModel from './model/points-model.js';


const TRIP_EVENTS_COUNT = 15;

const tripEvents = Array.from({length: TRIP_EVENTS_COUNT}, eventTypes);
const pageMainElement = document.querySelector('.page-body');

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripControlsNavigationElement = document.querySelector('.trip-controls__navigation');

const pointsModel = new PointsModel();
pointsModel.points = tripEvents;

render(tripControlsFiltersElement, new TripFiltersView(), RenderPosition.BEFOREEND);
render(tripControlsNavigationElement, new TripTabsView(), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(pageMainElement, pointsModel);
tripPresenter.init();

import {renderTemplate, RenderPosition} from './render.js';
import {createTripTabsTemplate} from './view/trip-tabs-view.js';
import {createTripFiltersTemplate} from './view/trip-filters-view.js';
import {createTripSortTemplate} from './view/trip-sort-view.js';
import {createTripEventsItemTemplate} from './view/trip-events-item-view.js';
import { generateTripEvent } from './mock/trip-event.js';
import { createAddEventItemTemplate } from './view/add-event-item-view.js';
import { createEventsListTemplate } from './view/event-list-view.js';
import {createEditedEventItemTemplate} from './view/edit-event-item-view';

const TRIP_EVENTS_COUNT = 15;

const tripEvents = Array.from({length: TRIP_EVENTS_COUNT}, generateTripEvent);

const tripControlsNavigationElement = document.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

renderTemplate(tripEventsElement, createEventsListTemplate(), RenderPosition.BEFOREEND);

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

renderTemplate(tripControlsNavigationElement, createTripTabsTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripControlsFiltersElement, createTripFiltersTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripEventsElement, createTripSortTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(tripEventsListElement, createEditedEventItemTemplate(tripEvents[1]), RenderPosition.AFTERBEGIN);
renderTemplate(tripEventsListElement, createAddEventItemTemplate(tripEvents[0]), RenderPosition.AFTERBEGIN);

for (let i = 2; i < TRIP_EVENTS_COUNT; i++) {
  renderTemplate(tripEventsListElement, createTripEventsItemTemplate(tripEvents[i]), RenderPosition.BEFOREEND);
}

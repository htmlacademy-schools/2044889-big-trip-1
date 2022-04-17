import { generateTripEvent } from './mock/trip-event.js';
import { render, RenderPosition } from './utils/render.js';
import AddEventItemView from './view/add-event-item-view.js';
import EventItemEditView from './view/edit-event-item-view.js';
import EventsListView from './view/event-list-view.js';
import TripEventItemView from './view/trip-events-item-view.js';
import TripFiltersView from './view/trip-filters-view.js';
import TripSortView from './view/trip-sort-view.js';
import TripTabsView from './view/trip-tabs-view.js';
import NoTripsView from './view/no-trips-view.js';


const TRIP_EVENTS_COUNT = 20;

const tripEvents = Array.from({length: TRIP_EVENTS_COUNT}, generateTripEvent);

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripControlsNavigationElement = document.querySelector('.trip-controls__navigation');
const tripEventsElement = document.querySelector('.trip-events');
const tripEventsListElement = new EventsListView();

render(tripControlsFiltersElement, new TripFiltersView(), RenderPosition.BEFOREEND);
render(tripControlsNavigationElement, new TripTabsView(), RenderPosition.BEFOREEND);

if (tripEvents.length === 0) {
  render(tripEventsElement, new NoTripsView(), RenderPosition.BEFOREEND);
} else {
  render(tripEventsElement, new TripSortView(), RenderPosition.AFTERBEGIN);
  render(tripEventsElement, tripEventsListElement, RenderPosition.BEFOREEND);
  render(tripEventsListElement.element, new AddEventItemView(tripEvents[0]), RenderPosition.BEFOREEND);
}

const renderEvent = (eventListElement, event) => {
  const eventItemComponent = new TripEventItemView(event);
  const eventEditComponent = new EventItemEditView(event);

  const changeFormToItem = () => {
    eventListElement.replaceChild(eventItemComponent.element, eventEditComponent.element);
  };

  const changeItemToForm = () => {
    eventListElement.replaceChild(eventEditComponent.element, eventItemComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      changeFormToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventEditComponent.setRollupClickHandler(() => {
    changeItemToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventItemComponent.clickHandler(() => {
    changeFormToItem();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventEditComponent.setFormSubmit(() => {
    changeFormToItem();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(eventListElement, eventItemComponent, RenderPosition.BEFOREEND);
};


for (let i = 1; i < TRIP_EVENTS_COUNT; i++) {
  renderEvent(tripEventsListElement, tripEvents[i]);
}

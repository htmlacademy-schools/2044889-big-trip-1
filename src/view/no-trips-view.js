import AbstractView from './abstract-view';

const createNoTripsTemplate = () => (
  `<p class="trip-events__msg">
    Click New Event to create your first point
    </p>`
);

export default class NoTripsView extends AbstractView {
  get template() {
    return createNoTripsTemplate();
  }
}

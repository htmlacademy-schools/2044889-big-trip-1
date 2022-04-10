/* eslint-disable no-unused-vars */
import dayjs from 'dayjs';
import {locations} from '../mock/locations';
import {eventTypes} from '../mock/event-types';
import AbstractView from './abstract-view';

const createEventItemEditTemplate = (tripEvent) => {
  const {eventType, cost, location, startDate, endDate, offers, description} = tripEvent;
  const startDateTime = dayjs(startDate).format('D/MM/YY HH:mm');
  const endDateTime = dayjs(endDate).format('D/MM/YY HH:mm');
  const createOfferElement = (offer) => {
    const isChecked = offer.isChosen ? ' checked=""' : '';
    const {name, price, type} = offer;
    return `<div class="event__available-offers">
                      <div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-1" type="checkbox" name="event-offer-${offer.type}"${isChecked}>
                        <label class="event__offer-label" for="event-offer-name-1">
                          <span class="event__offer-title">${offer.name}</span>
                          +€&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;
  };

  const createOffersList = (editedOffers) => {
    if (editedOffers.length !== 0) {
      return `<section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>${editedOffers}</section>`;
    }
    return '';
  };

  const createLocationOption = (city) => (`<option value="${city}"></option>`);
  const createEventTypes = (types = eventTypes(), chosenEventType) => {
    const createType = (currentType) => {
      const isChecked = currentType === chosenEventType ? 'checked=""' : '';
      const label = String(currentType).charAt().toUpperCase() + String(currentType).slice(1);
      return `<div class="event__type-item">
                          <input id="event-type-${currentType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${currentType}" ${isChecked}>
                          <label class="event__type-label  event__type-label--${currentType}" for="event-type-${currentType}-1">${label}</label>
                        </div>`;
    };
    return types.map(createType).join('');
  };

  const eventTypesElement = createEventTypes(eventTypes(), eventType);
  const locationOptions = locations().map(createLocationOption).join('');
  const editedOffersElement = offers.map(createOfferElement).join('');
  const offersList = createOffersList(editedOffersElement);
  const eventTypeLabel = String(eventType).charAt().toUpperCase() + String(eventType).slice(1);
  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${eventTypesElement}
                      </fieldset>
                    </div>
                  </div>
                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${eventTypeLabel}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${location}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${locationOptions}
                    </datalist>
                  </div>
                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDateTime}">
                    —
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDateTime}">
                  </div>
                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      €
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
                  </div>
                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">${offersList}<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>
                  </section>
                </section>
              </form>
            </li>`;
};

export default class EventItemEditView extends AbstractView {
  #event = null;

  constructor(event) {
    super();
    this.#event = event;
  }

  get template() {
    return createEventItemEditTemplate(this.#event);
  }

  setFormSubmit = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('click', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  }
}

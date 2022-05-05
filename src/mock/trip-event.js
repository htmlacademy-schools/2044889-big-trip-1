import dayjs from 'dayjs';
import { eventTypes } from './event-types';
import { locations } from './locations';
import { nanoid } from 'nanoid';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a,b));
  const upper = Math.floor(Math.max(a,b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


const generateEventType = () => {
  const randomIndex = getRandomInteger(0, eventTypes.length - 1);
  return eventTypes[randomIndex];
};

const generateLocations = () => {
  const randomIndex = getRandomInteger(0, locations.length - 1);
  return locations[randomIndex];
};

const generateDates = () => {
  const maxGap = 14;

  const startDate = dayjs()
    .add(getRandomInteger(-maxGap, maxGap), 'day')
    .add(getRandomInteger(-maxGap, maxGap), 'hour')
    .add(getRandomInteger(-maxGap, maxGap), 'minute');

  const endDay = startDate
    .clone()
    .add(getRandomInteger(0, maxGap), 'day')
    .add(getRandomInteger(0, 59), 'hour')
    .add(getRandomInteger(0, 59), 'minute');

  return {
    start: startDate.toDate(),
    end: endDay.toDate()
  };
};

const countDuration = (start,end) => {
  const interval = new Date(end - start);

  return {
    days: interval.getUTCDate() - 1,
    hours: interval.getUTCHours(),
    minutes: interval.getUTCMinutes()
  };
};

const generateDescription = () =>{
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ' +
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. ' +
    'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  ];
  const randomIndex = getRandomInteger(0, description.length - 1);
  return description[randomIndex];
};

const generatePhotos = () => {
  const photos = [];

  for (let i = 0; i < 5; i++) {
    photos[i] = `http://picsum.photos/248/152?r=${Math.random()}`;
  }

  return photos;
};

const generatePrice = () => getRandomInteger(1, 100) * 10;

const generateOffers = () => {
  const offers = [
    {
      name: 'Add luggage',
      price: 30,
      isChosen: Boolean(getRandomInteger(0, 1)),
      type: 'luggage'
    },

    {
      name: 'Switch to Business Class',
      price: 200,
      isChosen: Boolean(getRandomInteger(0, 1)),
      type: 'flight'
    },

    {
      name: 'Add meal',
      price: 15,
      isChosen: Boolean(getRandomInteger(0, 1)),
      type: 'meal'
    },

    {
      name: 'Choose seats',
      price: 5,
      isChosen: Boolean(getRandomInteger(0, 1)),
      type: 'flight'
    },

    {
      name: 'Travel by train',
      price: 10,
      isChosen: Boolean(getRandomInteger(0, 1)),
      type: 'transport'
    },

    {
      name: 'Rent a car',
      price: 150,
      isChosen: Boolean(getRandomInteger(0, 1)),
      type: 'car'
    },

    {
      name: 'Branch in city',
      price: 30,
      isChosen: Boolean(getRandomInteger(0, 1)),
      type: 'meal'
    },

    {
      name: 'Add breakfast',
      price: 15,
      isChosen: Boolean(getRandomInteger(0, 1)),
      type: 'meal'
    }
  ];

  let count = getRandomInteger(0, 5);
  let leng = offers.length;
  const result = new Array(count);
  const taken = new Array(leng);

  if (count > leng) {
    throw new RangeError('getRandom: more elements taken than available');
  }

  while (count--) {
    const x = Math.floor(Math.random() * leng);
    result[count] = offers[x in taken ? taken[x] : x];
    taken[x] = --leng;
  }

  return result;
};

export const generateTripEvent = () => {
  const dates = generateDates();

  return {
    id: nanoid(),
    eventType: generateEventType(),
    location: generateLocations(),
    description: generateDescription(),
    photos: generatePhotos(),
    price: generatePrice(),
    offers: generateOffers(),
    startDate: dates.start,
    endDate: dates.end,
    duration: countDuration(dates.start, dates.end),
    isFavourite: Boolean(getRandomInteger(0, 1)),
    isBeingEdited: false
  };
};

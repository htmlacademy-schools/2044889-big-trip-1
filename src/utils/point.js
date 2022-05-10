import dayjs from 'dayjs';

const sortTaskByDay = (pointA, pointB) => dayjs(pointA.dateStart).diff(dayjs(pointB.dateStart));

const sortTaskByDuration = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateStart).diff(dayjs(pointA.dateEnd));
  const durationB = dayjs(pointB.dateStart).diff(dayjs(pointB.dateEnd));

  if (durationB - durationA !== 0) {
    return durationB - durationA;
  } else {
    return dayjs(pointA.dateEnd).diff(dayjs(pointB.dateEnd));
  }
};

const sortTaskByPrice = (pointA, pointB) => {
  if(pointB.basePrice - pointA.basePrice !== 0) {
    return pointB.basePrice - pointA.basePrice;
  } else {
    return dayjs(pointA.dateStart).diff(dayjs(pointB.dateStart));
  }
};

export {sortTaskByDay, sortTaskByDuration, sortTaskByPrice};

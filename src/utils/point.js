import dayjs from 'dayjs';

const sortTaskByDay = (pointA, pointB) => dayjs(pointA.startDate).diff(dayjs(pointB.startDate));

const sortTaskByDuration = (pointA, pointB) => {
  const durationA = dayjs(pointA.endDate).diff(dayjs(pointA.startDate));
  const durationB = dayjs(pointB.endDate).diff(dayjs(pointB.startDate));

  if (durationB - durationA !== 0) {
    return durationB - durationA;
  } else {
    return dayjs(pointA.startDate).diff(dayjs(pointB.startDate));
  }
};

const sortTaskByPrice = (pointA, pointB) => {
  if(pointB.price - pointA.price !== 0) {
    return pointB.price - pointA.price;
  } else {
    return dayjs(pointA.startDate).diff(dayjs(pointB.startDate));
  }
};

export {sortTaskByDay, sortTaskByDuration, sortTaskByPrice};

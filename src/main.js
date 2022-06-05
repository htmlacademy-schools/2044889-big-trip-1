import { render, RenderPosition, remove } from './utils/render.js';
import TripTabsView from './view/trip-tabs-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filters-model.js';
import StatsView from './view/statistics.js';
import { MenuItem } from './utils/const.js';
import ApiService from './service/api-service.js';

const AUTHORIZATION = 'Basic t6aho7n6316tmklnmae98';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const pageMainElement = document.querySelector('.page-body');
const tripControlsNavigationElement = document.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');

tripControlsFiltersElement.classList.add('visually-hidden');

const siteMenuComponent = new TripTabsView();

const tripPresenter = new TripPresenter(pageMainElement, pointsModel, filterModel, new ApiService(END_POINT, AUTHORIZATION));
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);

let mode = 'TABLE';

const handlePointNewFormClose = () => {
  siteMenuComponent.element.querySelector(`[data-menu-item=${MenuItem.TABLE}]`).classList.remove('visually-hidden');
  siteMenuComponent.element.querySelector(`[data-menu-item=${MenuItem.STATS}]`).classList.remove('visually-hidden');
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      if (mode !== 'TABLE') {
        filterPresenter.init();
        tripPresenter.init();
        remove(statisticsComponent);
        mode = 'TABLE';
      }
      break;
    case MenuItem.STATS:
      if (mode !== 'STATS') {
        filterPresenter.destroy();
        tripPresenter.destroy();
        statisticsComponent = new StatsView(pointsModel.points);
        render(pageMainElement, statisticsComponent, RenderPosition.BEFOREEND);
        mode = 'STATS';
      }
      break;
  }
};

filterPresenter.init();

tripPresenter.init().finally(() => {
  pointsModel.init().finally(() => {
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.BEFOREBEGIN);
    tripControlsFiltersElement.classList.remove('visually-hidden');
  });
});

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  remove(statisticsComponent);
  filterPresenter.destroy();
  filterPresenter.init();
  tripPresenter.destroy();

  tripPresenter.init().finally(() => {
    tripPresenter.createPoint(handlePointNewFormClose);
    siteMenuComponent.element.querySelector(`[data-menu-item=${MenuItem.TABLE}]`).classList.add('visually-hidden');
    siteMenuComponent.element.querySelector(`[data-menu-item=${MenuItem.STATS}]`).classList.add('visually-hidden');
    mode = 'TABLE';
  });
});

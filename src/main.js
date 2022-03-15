import {createSiteMenuTemplate} from './view/site-menu-view.js';
import { renderTemplate, RenderPosition } from './render.js';
import { createFilterTemplate } from './view/filter-view.js';
import { createSortingTemplate } from './view/sorting-view.js';
import { createContentTemplate } from './view/content-view.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

renderTemplate(siteHeaderElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortingTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createContentTemplate(), RenderPosition.BEFOREEND);

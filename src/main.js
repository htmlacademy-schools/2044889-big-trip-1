import {createSiteMenuTemplate} from './view/site-menu-view.js';
import { renderTemplate, RenderPosition } from './render.js';
import { createFilterTemplate } from './view/filter-view.js';
import { createLoadingTemplate } from './view/loading-view.js';
import { createListEmptyTemplate } from './view/list-empty-view.js';


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

renderTemplate(siteHeaderElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createLoadingTemplate(), RenderPosition.BEFOREBEGIN);
renderTemplate(siteMainElement, createListEmptyTemplate(), RenderPosition.BEFOREBEGIN);

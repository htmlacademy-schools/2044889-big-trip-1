const RenderPosition = {
    BEFOREBEGIN: 'beforebegin',
    AFTERBEGIN: 'afterbegin',
    BEFOREEND: 'beforeend',
    AFTEREND: 'afterend',
};

const renderTemplate = (container, template, place) => {
    container.insertAdjacentHTML(place, template);
}

<<<<<<< HEAD
export { RenderPosition, renderTemplate }
=======
export { RenderPosition, renderTemplate }
>>>>>>> 7aaf4bb4bd837c7b52b532ce53b094d09326f28f

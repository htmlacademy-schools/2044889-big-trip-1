export const createLoadingTemplate = () => (
  `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <title>Big Trip</title>

      <link rel="stylesheet" href="css/style.css">
    </head>

    <body class="page-body">
      <header class="page-header">
        <div class="page-body__container  page-header__container">
          <img class="page-header__logo" src="img/logo.png" width="42" height="42" alt="Trip logo">

          <div class="trip-main">
            <div class="trip-main__trip-controls  trip-controls">
              <div class="trip-controls__navigation">
                <h2 class="visually-hidden">Switch trip view</h2>
                <nav class="trip-controls__trip-tabs  trip-tabs">
                  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
                  <a class="trip-tabs__btn" href="#">Stats</a>
                </nav>
              </div>

              <div class="trip-controls__filters">
                <h2 class="visually-hidden">Filter events</h2>
                <form class="trip-filters" action="#" method="get">
                  <div class="trip-filters__filter">
                    <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
                    <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
                  </div>

                  <div class="trip-filters__filter">
                    <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" disabled>
                    <label class="trip-filters__filter-label" for="filter-future">Future</label>
                  </div>

                  <div class="trip-filters__filter">
                    <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" disabled>
                    <label class="trip-filters__filter-label" for="filter-past">Past</label>
                  </div>

                  <button class="visually-hidden" type="submit">Accept filter</button>
                </form>
              </div>
            </div>

            <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" disabled>New event</button>
          </div>
        </div>
      </header>

      <main class="page-body__page-main  page-main">
        <div class="page-body__container">
          <section class="trip-events">
            <h2 class="visually-hidden">Trip events</h2>

            <p class="trip-events__msg">Loading...</p>
          </section>
        </div>
      </main>
    </body>
  </html>
  `
)

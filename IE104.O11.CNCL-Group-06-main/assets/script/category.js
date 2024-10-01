import { fetchProductsData } from './fetchData.js';
import { Slide } from './slide.js';

async function loadDataOnCategories() {
  const query = new URLSearchParams(window.location.search);
  const category = query.get('category');
  const data = await fetchProductsData();
  // const gamesData = data.games;
  const games = [];

  for (const game of data.games) {
    if (
      game.tags.filter((tag) => tag.tagName.toLowerCase() === category).length >
      0
    ) {
      games.push(game);
    }
  }
  // console.log(games);
  // handleSearchBox(gamesData);

  loadGamesOnMoreGame(games);
  loadGamesOnFeature(games);
  const featureSlide = new Slide('featured', 'grid', 3000);
  featureSlide.start();
}

function loadGamesOnMoreGame(games) {
  const feature = document.getElementById('more-game');
  const htmlContent = games
    .map((item) => {
      return `
     
        <a class="filtered-game-container" href="../../pageNam?id=${item._id}">
            <img
            src="${item.imageUrl}"
            alt="${item.title}"
            />

            <div class="filtered-game-description">
                    <p class="filtered-game-name">${item.title}</p>

                    <div class="filtered-game-tags">
                        ${item.tags
                          .map(
                            (tag) =>
                              `<span class="game-tag">${tag.tagName}</span>`
                          )
                          .join('\n')}
                    </div>

                    
                    <p class="filtered-game-situation">Averages <span>${(
                      Math.random() * 100000
                    ).toFixed()} reviews</span></p>
            </div>

            <div class="filtered-game-price">
                <span class="sale">${
                  item.saleoff > 0 ? item.saleoff + '%' : 'Not Sale'
                }</span>
                <span class="game-price">${
                  item.price > 1000 ? item.price + 'đ' : 'Free to play'
                }</span>
                <button class="view-button">View Details...</button>
            </div>
        </a>
    `;
    })
    .join('\n');
  feature.innerHTML =
    htmlContent + `<button class="filtered-show-more">Show more</button>`;
}

function loadGamesOnFeature(games) {
  const feature = document.getElementById('featured');
  const htmlContent = games
    .map((item) => {
      return `

    <div class="featured-item fade">
      <img
        src="${item.imageUrl}"
        alt="${item.title}"
      />

      <div class="featured-game-infor-container">
        <h2 class="featured-game-name">${item.title}</h2>

        <p class="featured-game-date">
          Release date: <time datetime="2021-11-19">NOV 19, 2021</time>
        </p>

        <span class="featured-game-viewers"
          >Averages <span>${(
            Math.random() * 100000
          ).toFixed()} reviews</span></span
        >

        <div class="featured-game-tags">
        ${item.tags
          .map((tag) => `<span class="game-tag">${tag.tagName}</span>`)
          .join('\n')}
        </div>

        <p class="featured-game-status">
          ${item.description}
        </p>
      </div>
    </div>
    `;
    })
    .join('\n');
  feature.innerHTML += htmlContent;
}

export { loadDataOnCategories, loadGamesOnFeature };

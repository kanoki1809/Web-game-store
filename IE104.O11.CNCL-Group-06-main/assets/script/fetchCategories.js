import { fetchProductsData, fetchCategoriesData } from "./fetchData.js";
import { Slide } from "./slide.js";

async function loadDataOnCategories() {
  const query = new URLSearchParams(window.location.search);
  const category = query.get("category");
  const data = await fetchProductsData();
  const gamesData = data.games;
  const games = [];

  for (const game of data.games) {
    if (
      game.tags.filter(
        (tag) => tag.tagName.replace(/\s/g, "").toLowerCase() === category
      ).length > 0
    ) {
      games.push(game);
    }
  }
  console.log(games);

  loadCategoriesHomepage();
  handleSearchBox(gamesData);

  loadGamesOnFeature(games);
  // loadGamesOnGameGroup(games);
  loadGamesOnMoreGame(games);

  const featureSlide = new Slide("featured", "grid", 3000);
  featureSlide.start();
}

function loadGamesOnMoreGame(games) {
  const feature = document.getElementById("more-game");
  const htmlContent = games
    .map((item) => {
      return `
     
        <a class="filtered-game-container" href="../../gameDetail.html?id=${
          item._id
        }">
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
                          .join("\n")}
                    </div>

                    
                    <p class="filtered-game-situation">Averages <span>${(
                      Math.random() * 100000
                    ).toFixed()} reviews</span></p>
            </div>

            <div class="filtered-game-price">
                <span class="sale">${
                  item.saleoff > 0 ? item.saleoff + "%" : "Not Sale"
                }</span>
                <span class="game-price">${
                  item.price > 1000 ? item.price + "đ" : "Free to play"
                }</span>
                <button class="view-button">View Details...</button>
            </div>
        </a>
    `;
    })
    .join("\n");
  feature.innerHTML = htmlContent;
  // feature.innerHTML =
  //   htmlContent + `<button class="filtered-show-more">Show more</button>`;
}

function loadGamesOnFeature(games) {
  console.log(games);
  const feature = document.getElementById("featured");
  const htmlContent = games
    .map((item) => {
      return `

    <a class="featured-item fade" href="../../gameDetail.html?id=${item._id}">
      <img
        src="${item.imageUrl}"
        alt="${item.title}"
      />

      <div class="featured-game-infor-container">
        <h2 class="featured-game-name">${item.title}</h2>

        <span class="featured-game-viewers"
          >Averages <span>${(
            Math.random() * 100000
          ).toFixed()} reviews</span></span
        >

        <div class="featured-game-tags">
        ${item.tags
          .map((tag) => `<span class="game-tag">${tag.tagName}</span>`)
          .join("\n")}
        </div>

        <p class="featured-game-status">
          ${item.description}
        </p>
      </div>
    </a>
    `;
    })
    .join("\n");
  feature.innerHTML += htmlContent;
}

function handleSearchBox(games) {
  const searchBox = document.getElementById("search-form-input");
  const formResult = document.getElementById("hero__form-result");

  // Handle user input
  searchBox.addEventListener("input", (e) => handleInput(e, games, formResult));

  // Handle user blur or focus
  searchBox.addEventListener("blur", (e) => {
    if (!formResult.matches(":hover")) {
      formResult.style.display = "none";
    }
  });

  searchBox.addEventListener("focus", (e) => {
    formResult.style.display = "block";
  });

  // Prevent enter key submitting
  searchBox.addEventListener("keypress", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });
}

// Handle user input
function handleInput(e, games, formResult) {
  const keyWord = e.target.value;

  // Check if user have type yet
  if (keyWord) {
    const filteredGames = games.filter((game) =>
      game.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    const html = filteredGames
      .map((game) => {
        return `
      <a href="./gameDetail.html?id=${game._id}" class="hero-filtered-game">
        <img src="${game.imageUrl}" alt="${game.title}" class="hero-filtered-game__img"/>

        <div class="hero-filtered-game__info"> 
          <h7 class="hero-filtered-game__title line-clamp-2">${game.title}</h7>
        </div>

      </a>
    `;
      })
      .join("\n");
    if (html) {
      formResult.innerHTML = html;
      formResult.style.display = "block";
    } else {
      formResult.innerHTML = "";
      formResult.style.display = "none";
    }
  } else {
    formResult.innerHTML = "";
    formResult.style.display = "none";
  }
}

// Load categories on Homepage
async function loadCategoriesHomepage() {
  // Get categories
  const data = await fetchCategoriesData();
  const tags = data.tags.map((tag) => tag.tagName);

  // Seperate into small groups
  const smallGroups = [];
  const chunkSize = 4; // Item each group
  for (let i = 0; i < tags.length; i += chunkSize) {
    const chunk = tags.slice(i, i + chunkSize);
    smallGroups.push(chunk);
  }

  loadCategoriesOnHeader(smallGroups);
  loadCategoriesOnAside(tags);
  loadCategoriesPartInHomepage(smallGroups);
}

function loadCategoriesOnHeader(categories) {
  // Nav submenu
  const navSubmenu = document.getElementById("nav-submenu");
  navSubmenu.innerHTML = categories
    .map((tagGroup) => {
      return `
   <div class="nav-submenu-small-group">
      ${tagGroup
        .map((tag) => {
          return `
        <li><a class="nav-submenu-item" href="./categories.html?category=${tag
          .replace(/\s+/g, "")
          .toLowerCase()}">${tag}</a></li>
        `;
        })
        .join("\n")}
   </div>
  `;
    })
    .join("\n");
}

function loadCategoriesOnAside(categories) {
  const asideNavList = document.getElementById("aside-nav__list");
  asideNavList.innerHTML =
    categories
      .map((tag) => {
        return ` <li><a href="./categories.html?category=${tag
          .replace(/\s+/g, "")
          .toLowerCase()}" class="aside-nav__item">${tag}</a></li>`;
      })
      .join("\n") +
    `<li><a href="./categories.html?category=all" class="aside-nav__item">All</a></li>`;
}

function loadCategoriesPartInHomepage(categories) {
  // Handle categories array
  const html = categories
    .map((tagGroup) => {
      return `
  <div class="category-item fade">  
    ${tagGroup
      .map((tagItem) => {
        return `
      <a href="./categories.html?category=${tagItem
        .replace(/\s+/g, "")
        .toLowerCase()}" class="category-item-child">
        <img
          src="https://store.steampowered.com/categories/homepageimage/category/fighting_martial_arts?cc=us&l=english"
          alt=""
          class="category-item-child__img"
        />
        <div class="category-item-child__gradient"></div>
        <span class="category-item-child__label">${tagItem.toUpperCase()}</span>
      </a>`;
      })
      .join("\n")}
  </div>`;
    })
    .join("\n");
  const category = document.getElementById("category-group");
  category.innerHTML += html;

  // Add dots control group
  const slideControlGroup = document.querySelector(
    "#category .slide-control-group"
  );
  categories.forEach(
    () =>
      (slideControlGroup.innerHTML += `<div class="slide-control-item"></div>`)
  );

  // Create slide effect
  const categorySlide = new Slide("category", "grid");
  categorySlide.start();
}

export { loadDataOnCategories, loadGamesOnFeature };

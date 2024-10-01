import { Slide } from "./slide.js";
import { fetchProductsData, fetchCategoriesData } from "./fetchData.js";

// Load game data on Homepage
async function loadDataOnHomepage() {
  const data = await fetchProductsData();
  const gamesData = data.games;

  // Get random games
  const randomGames = [];
  const existedIndexes = [];
  while (existedIndexes.length < 10) {
    const randomIndex = Math.floor(Math.random() * gamesData.length);
    if (!existedIndexes.includes(randomIndex)) {
      randomGames.push(gamesData[randomIndex]);
      existedIndexes.push(randomIndex);
    }
  }

  // Load 4 first games on feature
  loadGamesOnFeature(
    randomGames.slice(0, 4),
    "feature-group",
    "feature__slide-control-group"
  );

  // Load the most 9 sold off games
  const mostSaleOffGames = gamesData.filter((item) => item.saleoff);
  loadGamesOnSpecial(
    mostSaleOffGames.slice(0, 9),
    "special-group",
    "special__slide-control-group"
  );

  // Search box
  handleSearchBox(gamesData);
}

// Load game on specific part (game data, game list container, dots group container, list item)
function loadGamesOnSpecificPart(
  data,
  listGameID,
  dotsGroupID,
  itemHtmlContent
) {
  // Load feature content
  const gameListContainer = document.getElementById(listGameID);
  gameListContainer.innerHTML += itemHtmlContent;

  // Load dots by number of games
  const dotsGroup = document.getElementById(dotsGroupID);
  let dots = [];
  data.forEach(() => dots.push('<div class="slide-control-item"></div>'));
  dotsGroup.innerHTML = dots.join("\n");
}

function loadGamesOnFeature(data, listGameID, dotsGroupID) {
  const html = data
    .map((item) => {
      return `
    <article class="feature-item fade">
    <!-- Main image -->
    <a href="./gameDetail.html?id=${item._id}" 
    class="feature-item__game-thumb-wrap">
      <img
        src="${item.imageUrl}"
        alt="${item.title}-thumb"
        class="feature-item__game-thumb"
      />
    </a>

    <!-- Info -->
    <div class="feature-item__info">
      <!-- Game title -->
      <h3 class="feature-item__app-name line-clamp-2">${item.title}</h3>

      <!-- Category tags -->
      <div class="feature-item__tags-group" >
        ${item.tags.map(
          (tag) =>
            `<a class="feature-item__tag" href="./categories.html?category=${tag.tagName
              .replace(/\s+/g, "")
              .toLowerCase()}">${tag.tagName}</a>`
        )}
      </div>

      <!-- Price and platform -->
      <div class="feature-item__more-info">
          ${
            !item.saleoff
              ? `<span class="feature-item__price-normal">${
                  item.price > 1000 ? item.price + "₫" : "Free to play"
                }</span>`
              : `<div class="feature-item__price-group">
                    <span class="feature-item__percent">
                    -${item.saleoff}%
                    </span>
                    <span class= "feature-item__old-price">${item.oldprice}₫</span>
                    <span class= "feature-item__current-price">${item.price}₫</span>
                </div>`
          }
        <div class="feature-item__platform">
          <i class="fa fa-windows"></i>
        </div>
      </div>

      <!-- Action btn -->
      <a class="feature-item__btn" href="./gameDetail.html?id=${
        item._id
      }" >More details...</a>
    </div>
  </article>
    `;
    })
    .join("\n");

  loadGamesOnSpecificPart(data, listGameID, dotsGroupID, html);

  // Slide effect
  const featureSlide = new Slide("feature", "grid", 9000);
  featureSlide.start();
}

function loadGamesOnSpecial(data, listGameID, dotsGroupID) {
  const smallGroups = [];

  const chunkSize = 3;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    smallGroups.push(chunk);
  }

  const html = smallGroups
    .map((item) => {
      return ` <div class="special-item fade">
         ${item
           .map((game) => {
             return `<a class="special-item-child" href="./gameDetail.html?id=${game._id}">
          <!-- Game thumb -->
          <img
            src="${game.imageUrl}"
            alt="${game.title}"
            class="special-item-child__thumb"
          />
          <div class="special-item-child__content">
            <!-- Game title -->
            <h3 class="special-item-child__app-name line-clamp-2">${game.title}</h3>

            <!-- Sale % -->
            <strong class="special-item-child__sale-off"
              >Up to -${game.saleoff}%</strong
            >
          </div>
        </a>`;
           })
           .join("\n")}
        </div>`;
    })
    .join("\n");

  loadGamesOnSpecificPart(smallGroups, listGameID, dotsGroupID, html);

  // Slide effect
  const specialSlide = new Slide("special", "grid", 5000);
  specialSlide.start();
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
  asideNavList.innerHTML = categories
    .map((tag) => {
      return ` <li><a href="./categories.html?category=${tag
        .replace(/\s+/g, "")
        .toLowerCase()}" class="aside-nav__item">${tag}</a></li>`;
    })
    .join("\n");
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

// Handle search box
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

export { loadDataOnHomepage, loadCategoriesHomepage };

import { fetchProductsData } from "./fetchData.js";

async function loadDataGameTab() {
  const data = await fetchProductsData();
  const games = data.games;
  loadGameTab(games);

  addEffectFilterTab();
  addViewMoreEffect();
}

//create game tab
function loadGameTab(games) {
  const gameTabContainers = document.querySelectorAll(
    ".filtered-game-container"
  );
  const html = games.map((item) => {
    return `<a class="filtered-game" href=/gameDetail.html?id=${item._id}>
        <img src="${item.imageUrl}" alt="game image" />
        <div class="filtered-game-description">
          <div class="filtered-game-name-platform-tags">
            <span class="filtered-game-name">${item.title}</span>
            <div class="filtered-game-platform">
              <i
                class="fa-brands fa-windows fa-lg"
                style="color: # 7f97a5"
              ></i>
            </div>
            <div class="filtered-game-tags">
              ${getGameTag(item)}
            </div>
          </div>
          ${
            item.saleoff
              ? `<div class="filtered-game-discount">
            <span>${item.saleoff}%</span>
            </div>`
              : ``
          }
          <div class="filtered-game-price">
          ${
            !item.saleoff
              ? `<span class="original-price"></span>`
              : `<span class="original-price">${item.oldprice}₫</span>`
          }
          ${
            item.price < 1000 || !item.price
              ? `<span class="discounted-price">Free To Play</span>`
              : `<span class="discounted-price">${item.price}₫</span>`
          }
          </div>
        </div>
    </a>`;
  });

  let randomArray = [];
  for (let i = 0; i < 24; i++) {
    randomArray.push(i);
  }
  randomArray = shuffle(randomArray);

  for (let i = 0; i < gameTabContainers.length; i++) {
    gameTabContainers[i].innerHTML += html[randomArray[i]];
  }
}

function cleanDataGameTab() {
  const gameTabContainers = document.querySelectorAll(
    ".filtered-game-container"
  );
  gameTabContainers[0].removeChild(gameTabContainers[0].lastChild);
  for (let i = 1; i < gameTabContainers.length; i++) {
    gameTabContainers[i].innerHTML = "";
  }
}

// get game tag
function getGameTag(game) {
  let html = "";
  for (let i = 0; i < game.tags.length; i++) {
    if (i === game.tags.length - 1) {
      html += `<span class="game-tag">${game.tags[i].tagName}</span>\n`;
    } else html += `<span class="game-tag">${game.tags[i].tagName},</span>\n`;
  }
  return html;
}

//effect for filterTab
async function setFilterTabActive() {
  const filter_tab = document.querySelectorAll(".filter-tab");
  const anchor = document.querySelector(".see-more-anchor");
  const seeMoreBtn = document.querySelector(".see-more-button");
  filter_tab.forEach((element) => {
    if (element.classList.contains("active")) {
      element.classList.remove("active");
    }
  });
  this.classList.add("active");
  //checkbox.style.display = "none";
  switch (this.innerText) {
    case "News & Trending":
      anchor.innerText = "New Realeases";
      break;
    case "Top Sellers":
      anchor.innerText = "Top Sellers";
      //checkbox.style.display = "flex";
      break;
    case "Popular Upcoming":
      anchor.innerText = "Upcomming Realeases";
      break;
    case "Specials":
      anchor.innerText = "Specials";
      break;
  }

  cleanDataGameTab();
  const data = await fetchProductsData();
  const games = data.games;
  loadGameTab(games);
  if (seeMoreBtn.textContent === "Show less") {
    seeMoreBtn.click();
  }
}

//view more button
function addViewMoreEffect() {
  const btn = document.querySelector(".see-more-button");

  btn.addEventListener("click", () => {
    const gameTabContainers = document.querySelectorAll(
      ".filtered-game-container"
    );
    gameTabContainers.forEach((element) => {
      if (element.classList.length === 2) {
        if (element.classList.contains("hide")) {
          element.classList.remove("hide");
          element.classList.add("show");
        } else {
          element.classList.remove("show");
          element.classList.add("hide");
        }
      }
    });

    if (btn.classList.contains("nonactive")) {
      btn.classList.replace("nonactive", "active");
      btn.textContent = "Show less";
    } else {
      btn.classList.replace("active", "nonactive");
      btn.textContent = "View more";
    }
  });
}

function addEffectFilterTab() {
  const filter_tab = document.querySelectorAll(".filter-tab");
  filter_tab.forEach((element) => {
    element.addEventListener("click", setFilterTabActive);
  });
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export { loadDataGameTab };

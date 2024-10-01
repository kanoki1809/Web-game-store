import { fetchProductsData, fetchCategoriesData } from './fetchData.js';

var params = new URLSearchParams(window.location.search);
var id = params.get('id');

function convertISOToNormalDate(isoDateString) {
  const date = new Date(isoDateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const normalDateString = `${day}-${month}-${year}`;
  return normalDateString;
}

async function loadDataGameInfo() {
  var resData;
  try {
    const response = await fetch('http://localhost:8080/products/' + id);
    if (!response.ok) {
      const error = new Error('Fetching product failed');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
    resData = await response.json();
    return resData;
  } catch (error) {
    console.log(error);
  }
}

// Create game tab
loadDataGameInfo().then((data) => {
  console.log(data);
  const game = data.game;
  document.title = game.title;
  const html = `<div class="filtered-game">
      <h2 class="heading"${game.title}></h2>
              <div class="media_game">
                <iframe autoplay loop muted reload="auto" src="${
                  game.videoUrl
                }" type="video/mp4"></iframe>
                <div class="info_game">
                  <img src="${game.imageUrl}" alt="${game.title}">
                  <div class="if_game">${game.description}</div>
         
                  <div class="date">Released date: ${convertISOToNormalDate(
                    game.releaseDate
                  )}</div>
                  <div class="filtered-game-tags">${getGameTag(
                    game
                  )}</div>                   
                </div>
              </div>
             
              <div class="buy_games">
                <p>${game.title}</p>
                <div class="button_buy"> 
                    ${
                      game.price
                        ? `<p class="price_block">-${game.saleoff}%</p>
                  
                    <div class="filtered-game-price">
                      <span class="original-price">${game.oldprice}</span>
                      <span class="discounted-price">${game.price}</span>
                    </div>`
                        : `<div class="filtered-game-price">
                    <span class="original-price-free">Free to play</span>
                    </div>`
                    }
                    <a href="#" class="buy_block" id="add_to_cart">Add to cart</a>
                </div>
              </div> 
      </div>`;
  const gameTabContainers = document.querySelector('.filtered-game-container');
  gameTabContainers.innerHTML = html;
  console.log(gameTabContainers);
  loadCategoriesGamepage();
  loadGamesMostLikeThis();
  searchGames();
  addGameToCart();
});

async function searchGames() {
  const productsData = await fetchProductsData();
  const gamesData = productsData.games;
  handleSearchBox(gamesData);
}

async function loadCategoriesGamepage() {
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
}

// Load categories
function loadCategoriesOnHeader(categories) {
  // Nav submenu
  const navSubmenu = document.getElementById('nav-submenu');
  navSubmenu.innerHTML = categories
    .map((tagGroup) => {
      return `
   <div class="nav-submenu-small-group">
      ${tagGroup
        .map((tag) => {
          return `
        <li><a class="nav-submenu-item" href="./categories.html?category=${tag
          .replace(/\s+/g, '')
          .toLowerCase()}">${tag}</a></li>
        `;
        })
        .join('\n')}
   </div>
  `;
    })
    .join('\n');
}

// Handle search box
function handleSearchBox(games) {
  const searchBox = document.getElementById('search-form-input');
  const formResult = document.getElementById('hero__form-result');

  // Handle user input
  searchBox.addEventListener('input', (e) => handleInput(e, games, formResult));

  // Handle user blur or focus
  searchBox.addEventListener('blur', (e) => {
    if (!formResult.matches(':hover')) {
      formResult.style.display = 'none';
    }
  });

  searchBox.addEventListener('focus', (e) => {
    formResult.style.display = 'block';
  });

  // Prevent enter key submitting
  searchBox.addEventListener('keypress', (e) => {
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
      .join('\n');
    if (html) {
      formResult.innerHTML = html;
      formResult.style.display = 'block';
    } else {
      formResult.innerHTML = '';
      formResult.style.display = 'none';
    }
  } else {
    formResult.innerHTML = '';
    formResult.style.display = 'none';
  }
}

// Get game tag
function getGameTag(game) {
  let html = '';
  for (let i = 0; i < game.tags.length; i++) {
    if (i === game.tags.length - 1) {
      html += `<a href="./categories.html?category=${game.tags[i].tagName
        .replace(/\s+/g, '')
        .toLowerCase()}"><span class="game-tag">${
        game.tags[i].tagName
      }</span></a>\n`;
    } else
      html += `<a href="./categories.html?category=${game.tags[i].tagName
        .replace(/\s+/g, '')
        .toLowerCase()}"><span class="game-tag">${
        game.tags[i].tagName
      }</span></a>\n`;
  }
  return html;
}

// Add game to cart
async function addGameToCart() {
  const addToCartBtn = document.getElementById('add_to_cart');
  console.log(addToCartBtn);
  let button = addToCartBtn;
  button.onclick = async function () {
    const data = await addDataToCart(id);
    if (data === undefined) {
      window.alert(
        'This game has already been purchased or added to your cart!'
      );
    } else {
      window.location.assign('./cart.html');
    }
  };
}

async function addDataToCart(idGame) {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch('http://localhost:8080/shop/post-cart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: idGame }),
      });
      if (!response.ok) {
        const error = new Error('Adding game to cart failed');
        error.code = response.status;
        error.info = await response.json();
        throw error;
      }
      const resData = await response.json();
      return resData;
    } catch (error) {
      console.log(error);
    }
  } else {
    window.location.assign('./login.html');
    return token;
  }
}

async function loadGamesMostLikeThis() {
  const productsData = await fetchProductsData();
  const gamesData = productsData.games;

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

  // Load 3 games most like this
  const games = randomGames.slice(0, 3);
  const gameListContainer = document.getElementById('most_like');
  for (let item of games) {
    const itemHtmlContent = `
      <div class="like_game">
        <a href="/gameDetail.html?id=${item._id}">
            <img src="${item.imageUrl}" >
            <p>${item.title}</p>
            <p>${item.price}₫</p>
        </a>
      </div>`;
    gameListContainer.innerHTML += itemHtmlContent;
  }
}

const fetchUser = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch('http://localhost:8080/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const error = new Error('Fetching user failed');
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
  }
};

const profileContainer = document.querySelector('.profile-container');
profileContainer.innerHTML = '<span class="loader"></span>';

fetchUser().then(({ user }) => {
  const ordersList = user.games
    .map((game) => {
      let priceText = game.price === 0 ? '' : game.price;
      let saleOffText = game.price === 0 ? 'Free to play' : `-${game.saleoff}%`;
      let oldPriceText = game.price === 0 ? '' : game.oldprice;
      return `
    <li class="order-item">
    <img
        src="${game.imageUrl}"
        alt=""
        class="order__img"
    />
    <div class="order__info__left">
        <p class="order__name">${game.title}</p>
        <ul class="order__tags-list">
            ${game.tags
              .map((tag) => {
                return `<li class="order__tag-item">${tag.tagName}</li>`;
              })
              .join(',')}
        </ul>
    </div>
    </li>
    `;
    })
    .join('');

  profileContainer.innerHTML = `
    <section class="profile-header">
    <img
        src='./assets/images/avatar.jpg'
        alt=""
        class="profile-avatar"
    />
    <p class="profile-name">${user.username}</p>
    </section>
    <div class="orders">
    <h2>Your games</h2>
  
    <ul class="orders-list">
    ${ordersList}
    </ul>
    </div>
    </div> 
  `;
});

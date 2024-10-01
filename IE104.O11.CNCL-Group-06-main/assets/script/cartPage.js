import { fetchUserCart } from './fetchCart.js';

async function loadDataOnCart() {
  const data = await fetchUserCart();
  const cartData = data.cart;
  console.log(data);
  loadItemsOnCart(cartData);
  deleteItemsOnCart(cartData);
  deleteAllItemsOnCart();
  addItemsToProfile(cartData);
}

async function loadItemsOnCart(cart) {
  const cartListContainer = document.getElementById('cart_item_list');
  const cartTotalPrice = document.getElementById('cart_estimated_total');
  let totalPrice = 0;
  for (let item of cart) {
    const itemHtmlContent = `
        <div class="cart_item">
            <div class="cart_item_price">
                <div class="price">${item.price}₫</div>
                <a class="remove_link remove_each" href="#">Remove</a>
            </div>
            <div class="cart_item_img">
                <a href="/gameDetail.html?id=${item._id}">
                    <img src="${item.imageUrl}" alt="${item.title}" width="120" height="50">
                </a>
            </div>
            <div class="cart_item_desc">
                <div class="cart_item_platform">
                    <span class="win_platform_img"></span>
                </div>
                <a href="/gameDetail.html?id=${item._id}">${item.title}</a><br>
            </div>
        </div>`;
    cartListContainer.innerHTML += itemHtmlContent;
    totalPrice += item.price;
  }
  cartTotalPrice.innerHTML = totalPrice + '₫';
}

async function deleteDataOnCart(idGame) {
  const token = localStorage.getItem('token');
  console.log(idGame);
  if (token) {
    try {
      const response = await fetch(
        'http://localhost:8080/shop/delete-in-cart',
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gameId: idGame }),
        }
      );
      if (!response.ok) {
        const error = new Error('Removing game from cart failed');
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
}

async function deleteItemsOnCart(cart) {
  const deleteBtn = document.getElementsByClassName('remove_each');
  console.log(deleteBtn);
  for (let i = 0; i < deleteBtn.length; i++) {
    let button = deleteBtn[i];
    button.onclick = async function(event) {
      const buttonClicked = event.target;
      await deleteDataOnCart(cart[i]._id);
      buttonClicked.parentElement.parentElement.remove();
      window.location.reload();
      return false;
    };
  }
}

async function deleteAllDataOnCart() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch('http://localhost:8080/shop/delete-all-cart', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = new Error('Removing all games from cart failed');
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
}

async function deleteAllItemsOnCart() {
  const deleteBtn = document.getElementById('remove_all');
  console.log(deleteBtn);
  let button = deleteBtn;
  button.onclick = async function(event) {
    const buttonClicked = event.target;
    await deleteAllDataOnCart();
    let cartItemList = buttonClicked.parentElement.parentElement.firstElementChild;
    while (cartItemList.childElementCount > 0) {
        cartItemList.firstElementChild.remove();
    }
    let cartTotalPrice = buttonClicked.parentElement.parentElement.children[1].firstElementChild.children[1];
    cartTotalPrice.textContent = "0₫";
    let cartStatus = buttonClicked.parentElement.parentElement.parentElement.firstElementChild;
    cartStatus.remove();
    return false;
  };
}

async function addDataToProfile() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch('http://localhost:8080/shop/post-cart-to-user', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = new Error('Posting cart to user failed');
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
}

async function addItemsToProfile(cart) {
  const purchaseBtn = document.getElementById('myself_purchase_button');
  console.log(purchaseBtn);
  let button = purchaseBtn;
  button.onclick = async function() {
    if (cart.length != 0) {
      await addDataToProfile();
      window.location.assign('./profile.html');
    }
    else {
      window.alert("No items in your cart!");
    }
  };
}

export { loadDataOnCart };

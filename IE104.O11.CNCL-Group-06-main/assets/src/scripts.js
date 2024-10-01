const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
function initJsToggle() {
  $$('.js-toggle').forEach((button) => {
    const target = button.getAttribute('toggle-target');
    if (!target) {
      document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
    }
    button.onclick = () => {
      if (!$(target)) {
        return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
      }
      const isHidden = $(target).classList.contains('hide');

      requestAnimationFrame(() => {
        $(target).classList.toggle('hide', !isHidden);
        $(target).classList.toggle('show', isHidden);
      });
    };
  });
}

window.addEventListener('template-loaded', initJsToggle);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
  const cached = localStorage.getItem(path);
  if (cached) {
    $(selector).innerHTML = cached;
  }

  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      if (html !== cached) {
        $(selector).innerHTML = html;
        localStorage.setItem(path, html);
      }
    })
    .finally(() => {
      window.dispatchEvent(new Event('template-loaded'));
    });
}

const getUser = async () => {
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
    const profileEle = $('.profile-info');
    profileEle.style.display = 'none';
    const logoutBtn = $('.logout-btn');
    logoutBtn.style.display = 'none';
  }
};

function checkUser() {
  getUser()
    .then((response) => {
      if (response) {
        const user = response.user;
        const profileEle = $('.profile-info');
        profileEle.innerHTML = `
      <a href="./profile.html">
          <div class="profile-inner">
              <img
              src='./assets/images/avatar.jpg'
              alt=""
              class="profile-nav-avatar"
              />
              <p class="profile-nav-name">${user.username}</p>
          </div>
      </a>
      `;
        const navItems = $$('.global-nav-item.mobile');
        navItems.forEach((item) => {
          item.style.display = 'none';
        });

        const logoutBtn = $('.global-nav-item:last-child');
        logoutBtn.classList.add('.logout-btn');

        const actionEle = $('.global-header-action-container');

        actionEle.innerHTML = `
        <a href="./profile.html" class="header-name">${user.username}</a>
          <img src="./assets/images/avatar.jpg" alt="" class="header-avatar" />
          <div class="header-dropdown">
            <ul>
              <li class="drop-down__item">
                <a href="./profile.html">View my profile</a>
              </li>
              <li class="logout-btn drop-down__item">Sign out of account</li>
            </ul>
        </div>`;

        const logoutBtns = $$('.logout-btn');
        logoutBtns.forEach((btn) => {
          btn.onclick = () => {
            localStorage.removeItem('token');
            window.location.assign('./login.html');
          };
        });
      } else {
        const actionEle = $('.global-header-action-container');
        actionEle.innerHTML = `
        <a
        class="global-header__action-btn global-header__btn"
        href="./login.html"
        >login</a
        >
        <a
        class="global-header__action-btn global-header__btn"
        href="./signup.html"
        >signup</a
        >
        `;
      }
    })
    .catch();
}

window.addEventListener('template-loaded', checkUser);

function createAuthPage(mode = 'login') {
    document.body.innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-container">
          <h2>${mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
          <form id="authForm">
            ${mode === 'register' ? '<input type="text" placeholder="Логин" name="login" required />' : ''}
            <input type="tel" placeholder="Номер телефона" name="phone" required />
            <input type="password" placeholder="Пароль" name="password" required />
            ${mode === 'login' ? '<label class="remember"><input type="checkbox" name="remember" /> Запомнить меня</label>' : ''}
            <button type="submit">${mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
            ${mode === 'login' ? '<p><a href="#" id="forgotPassword">Забыли пароль?</a></p>' : ''}
            <p>${mode === 'login' ? 'Нет аккаунта?' : 'Есть аккаунт?'} <a href="#" id="switchMode">${mode === 'login' ? 'Регистрация' : 'Вход'}</a></p>
          </form>
        </div>
      </div>
    `;
  
    document.getElementById("switchMode").addEventListener("click", function (e) {
      e.preventDefault();
      createAuthPage(mode === 'login' ? 'register' : 'login');
    });
  
    if (mode === 'login') {
      document.getElementById("forgotPassword").addEventListener("click", function (e) {
        e.preventDefault();
        alert("Форма восстановления пока в разработке.");
      });
    }
  
    document.getElementById("authForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const form = e.target;
      const phone = form.phone.value.trim();
      const password = form.password.value;
      const users = JSON.parse(localStorage.getItem("users")) || [];
  
      if (mode === 'register') {
        const login = form.login.value.trim();
        const userExists = users.find(u => u.login === login || u.phone === phone);
  
        if (userExists) {
          alert("Пользователь с таким логином или номером уже существует.");
          return;
        }
  
        users.push({ login, phone, password });
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify({ login, phone }));
        renderLoggedInHeader(login);
      } else {
        const user = users.find(u => u.phone === phone && u.password === password);
        if (!user) {
          alert("Неверный номер телефона или пароль.");
          return;
        }
  
        localStorage.setItem("currentUser", JSON.stringify({ login: user.login, phone: user.phone }));
        renderLoggedInHeader(user.login);
      }
    });
  }
  
  function renderLoggedInHeader(username) {
    document.body.innerHTML = `
      <header>
        <div class="logo">JoinUs</div>
        <nav>
          <button onclick="alert('Лента еще в разработке')">Лента</button>
          <button onclick="alert('Чат еще в разработке')">Чат</button>
          <button onclick="alert('Профиль еще в разработке')">Профиль</button>
          <div class="dropdown">
            <button class="dropdown-toggle">Настройки (${username})</button>
            <div class="dropdown-menu">
              <button id="logoutButton">Выйти из аккаунта</button>
            </div>
          </div>
        </nav>
      </header>
      <main>
        <h1>Добро пожаловать в <span style="color: #3b82f6;">JoinUs!</span></h1>
        <p>Социальная сеть нового поколения — общайтесь, находите друзей, делитесь своими постами и многое другое!</p>
      </main>
    `;
  
    document.getElementById("logoutButton").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      location.reload();
    });
  }
  
  window.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      renderLoggedInHeader(currentUser.login);
    } else {
      const authButton = document.getElementById("authButton");
      if (authButton) {
        authButton.addEventListener("click", function () {
          createAuthPage('login');
        });
      }
    }
  });
  
  

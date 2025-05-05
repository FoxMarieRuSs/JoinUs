function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function createAuthPage(mode = 'login') {
  document.body.innerHTML = `
    <div class="auth-wrapper">
      <div class="auth-container">
        <h2>${mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
        <form id="authForm">
          ${mode === 'register' ? '<input type="text" placeholder="Логин" name="login" required />' : ''}
          <input type="tel" placeholder="Номер телефона" name="phone" required />
          <input type="password" placeholder="Пароль" name="password" required />
          ${mode === 'login' ? `
            <label class="remember"><input type="checkbox" name="remember" /> Запомнить меня</label>
            <div class="otp-container" id="otpContainer">
              <p>Введите код из SMS:</p>
              <input type="text" class="otp-input" maxlength="1" id="otp1">
              <input type="text" class="otp-input" maxlength="1" id="otp2">
              <input type="text" class="otp-input" maxlength="1" id="otp3">
              <input type="text" class="otp-input" maxlength="1" id="otp4">
              <button type="button" id="resendOTP">Отправить снова</button>
            </div>
          ` : ''}
          <button type="submit" id="submitBtn">${mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
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

    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        if (input.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
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

      const otpContainer = document.getElementById("otpContainer");
      if (otpContainer.style.display === 'none' || !otpContainer.style.display) {
        const otp = generateOTP();
        localStorage.setItem("tempOTP", otp);
        alert(`Демо: Код OTP отправлен на номер ${phone}. Код: ${otp}`);
        
        otpContainer.style.display = 'block';
        document.getElementById("submitBtn").textContent = 'Подтвердить';
        document.getElementById("otp1").focus();
        
        document.getElementById("resendOTP").addEventListener("click", function() {
          const newOTP = generateOTP();
          localStorage.setItem("tempOTP", newOTP);
          alert(`Демо: Новый код OTP отправлен. Код: ${newOTP}`);
        });
        
        return;
      } else {
        const enteredOTP = Array.from(document.querySelectorAll('.otp-input'))
          .map(input => input.value)
          .join('');
          
        const savedOTP = localStorage.getItem("tempOTP");
        
        if (enteredOTP !== savedOTP) {
          alert("Неверный код подтверждения");
          return;
        }
        
        localStorage.removeItem("tempOTP");
      }

      if (form.remember && form.remember.checked) {
        localStorage.setItem("rememberedUser", JSON.stringify({ phone, password }));
      } else {
        localStorage.removeItem("rememberedUser");
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
          <button class="dropdown-toggle">${username}</button>
          <div class="dropdown-menu">
            <button id="logoutButton">Выйти</button>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <h1>Добро пожаловать в <span class="logo-blue">JoinUs!</span></h1>
      <p>Социальная сеть нового поколения — общайтесь, находите друзей, делитесь своими постами и многое другое!</p>
      <p class="subtitle">Твоё пространство для настоящего общения!</p>
      <div class="features">
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">👥</div>
          </div>
          <h3 class="feature-title">Находи единомышленников</h3>
          <p class="feature-desc">Создавай свой аккаунт и находи людей с такими же интересами, что и у тебя!</p>
          <div class="feature-wave"></div>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">🎨</div>
          </div>
          <h3 class="feature-title">Выражай себя</h3>
          <p class="feature-desc">Посты про истории, интересы и многое другое!</p>
          <div class="feature-wave"></div>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">🔒</div>
          </div>
          <h3 class="feature-title">Полная приватность</h3>
          <p class="feature-desc">Гибкие настройки видимости для каждого поста и категории контактов</p>
          <div class="feature-wave"></div>
        </div>
      </div>
      
      <div class="hero-image">
        <img src="https://static.tildacdn.com/tild3939-3761-4033-b336-373461383139/fcd845f3188a7428e060.jpg" alt="Люди общаются в социальной сети">
      </div>
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
    const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));
    if (rememberedUser) {
      createAuthPage('login');
      document.querySelector('input[name="phone"]').value = rememberedUser.phone;
      document.querySelector('input[name="password"]').value = rememberedUser.password;
      document.querySelector('input[name="remember"]').checked = true;
    } else {
      const authButton = document.getElementById("authButton");
      if (authButton) {
        authButton.addEventListener("click", function () {
          createAuthPage('login');
        });
      }
    }
  }
});

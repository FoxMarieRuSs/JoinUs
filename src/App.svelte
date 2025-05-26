<script>
  import { onMount } from 'svelte';
  import Home from './Home.svelte';
  import { initAuth, login, logout } from './auth';
  
  let currentUser = null;
  let isLoading = true;

  onMount(async () => {
    const user = await initAuth();
    if (user) {
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    isLoading = false;
  });

  function handleLogin() {
    login();
  }

  function handleLogout() {
    localStorage.removeItem('currentUser');
    logout();
  }
</script>

<main>
  {#if isLoading}
    <div class="loading-spinner"></div>
  {:else if currentUser}
    <Home 
      username={currentUser.login} 
      onLogout={handleLogout} 
      userPicture={currentUser.picture}
    />
  {:else}
    <div class="welcome-page">
      <header>
        <div class="logo">JoinUs</div>
        <nav>
          <button on:click={() => alert('To start, you need to register or log in to the website!')}>Feed</button>
          <button on:click={() => alert('To start, you need to register or log in to the website!')}>Chat</button>
          <button on:click={() => alert('To start, you need to register or log in to the website!')}>Profile</button>
          <button id="authButton" on:click={handleLogin}>
            Login with Auth0
          </button>
        </nav>
      </header>

      <div class="main-content">
        <h1>Welcome to <span style="color: #3b82f6;">JoinUs!</span></h1>
        <p>
          A next-generation social network - communicate, find friends, share your posts and much more!
        </p>
        <p class="subtitle">Your space for real communication!</p>

        <div class="features">
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">👥</div>
            </div>
            <h3 class="feature-title">Find like-minded people</h3>
            <p class="feature-desc">Create your account and find people with similar interests!</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">🎨</div>
            </div>
            <h3 class="feature-title">Express yourself</h3>
            <p class="feature-desc">Posts about stories, interesting moments and much more!</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">🔒</div>
            </div>
            <h3 class="feature-title">Complete privacy</h3>
            <p class="feature-desc">Flexible visibility settings for each post and contact category</p>
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(to bottom right, #0f0f0f, #1a1a1a);
    color: white;
    min-height: 100vh;
  }

  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #3b82f6;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px;
    background-color: #121212;
    box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  .logo {
    font-size: 24px;
    font-weight: bold;
    color: #3b82f6;
  }

  nav {
    display: flex;
    gap: 12px;
  }

  nav button {
    background: none;
    border: 1px solid #444;
    padding: 8px 16px;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }

  nav button:hover {
    background: #2a2a2a;
  }

  #authButton {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  #authButton:hover {
    background-color: #2563eb;
  }

  .main-content {
    text-align: center;
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
  }

  h1 {
    font-size: 48px;
    margin-bottom: 16px;
    font-weight: 700;
    color: white;
  }

  p {
    font-size: 18px;
    color: #ddd;
    max-width: 600px;
    margin: 0 auto 20px;
  }

  .subtitle {
    font-size: 24px;
    margin-bottom: 30px;
    color: #a5b4fc;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    margin: 50px 0;
  }

  .feature-card {
    position: relative;
    background: rgba(30, 30, 30, 0.7);
    border-radius: 16px;
    padding: 30px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  .feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(59, 130, 246, 0.4);
  }

  .feature-icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
  }

  .feature-icon {
    font-size: 28px;
    transition: transform 0.3s;
  }

  .feature-card:hover .feature-icon {
    transform: scale(1.2);
  }

  .feature-title {
    font-size: 20px;
    margin-bottom: 15px;
    color: #fff;
    font-weight: 600;
  }

  .feature-desc {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    font-size: 15px;
  }
</style>


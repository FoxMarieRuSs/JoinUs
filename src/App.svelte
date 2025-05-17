<script>
  import { onMount } from 'svelte';
  import Home from './Home.svelte';
  import Auth from './Auth.svelte';

  let currentUser = null;
  let showAuth = false;
  let authMode = 'login';

  onMount(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      currentUser = JSON.parse(userData);
    }
  });

  function handleLogin(username) {
    currentUser = { login: username };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showAuth = false;
  }

  function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
  }

  function showAuthPage(mode) {
    authMode = mode;
    showAuth = true;
  }
</script>

<main>
  {#if showAuth}
    <Auth 
      mode={authMode} 
      onLogin={handleLogin} 
    />
  {:else if currentUser}
    <Home 
      username={currentUser.login} 
      onLogout={handleLogout} 
    />
  {:else}
    <div class="welcome-page">
      <header>
        <div class="logo">JoinUs</div>
        <nav>
          <button on:click={() => alert('Feed is under development')}>Feed</button>
          <button on:click={() => alert('Chat is under development')}>Chat</button>
          <button on:click={() => alert('Profile is under development')}>Profile</button>
          <button id="authButton" on:click={() => showAuthPage('login')}>
            Register/Login
          </button>
        </nav>
      </header>

      <div class="main-content">
        <h1>Welcome to <span style="color: #3b82f6;">JoinUs!</span></h1>
        <p>
          A next-generation social network - communicate, find friends to spend time with,
          share posts about your interests and much more!
        </p>
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

  .main-content {
    text-align: center;
    margin-top: 100px;
    padding: 0 20px;
  }

  h1 {
    font-size: 40px;
    margin-bottom: 16px;
  }

  p {
    font-size: 18px;
    color: #ccc;
    max-width: 600px;
    margin: auto;
  }
</style>


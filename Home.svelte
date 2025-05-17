<script>
    export let username;
    export let onLogout;
  </script>
  
  <header>
    <div class="logo">JoinUs</div>
    <nav>
      <button on:click={() => alert('Feed is under development')}>Feed</button>
      <button on:click={() => alert('Chat is under development')}>Chat</button>
      <button on:click={() => alert('Profile is under development')}>Profile</button>
      <div class="dropdown">
        <button class="dropdown-toggle">{username}</button>
        <div class="dropdown-menu">
          <button on:click={onLogout}>Logout</button>
        </div>
      </div>
    </nav>
  </header>
  
  <main>
    <h1>Welcome to <span class="logo-blue">JoinUs!</span></h1>
    <p>A next-generation social network - communicate, find friends, share your posts and much more!</p>
    <p class="subtitle">Your space for real communication!</p>
    
    <div class="features">
      <div class="feature-card">
        <div class="feature-icon-wrapper">
          <div class="feature-icon">👥</div>
        </div>
        <h3 class="feature-title">Find like-minded people</h3>
        <p class="feature-desc">Create your account and find people with similar interests!</p>
        <div class="feature-wave"></div>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon-wrapper">
          <div class="feature-icon">🎨</div>
        </div>
        <h3 class="feature-title">Express yourself</h3>
        <p class="feature-desc">Posts about stories, interesting moments and much more!</p>
        <div class="feature-wave"></div>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon-wrapper">
          <div class="feature-icon">🔒</div>
        </div>
        <h3 class="feature-title">Complete privacy</h3>
        <p class="feature-desc">Flexible visibility settings for each post and contact category</p>
        <div class="feature-wave"></div>
      </div>
    </div>
    
    <div class="hero-image">
      <img src="https://static.tildacdn.com/tild3939-3761-4033-b336-373461383139/fcd845f3188a7428e060.jpg" alt="People communicating in social network">
    </div>
  </main>
  
  <style>
    .logo-blue {
      color: #3b82f6;
    }
    
    .dropdown {
      position: relative;
      display: inline-block;
    }
    
    .dropdown-toggle {
      background: none;
      border: 1px solid #444;
      padding: 8px 16px;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .dropdown-menu {
      display: none;
      position: absolute;
      right: 0;
      background-color: #1e1e1e;
      min-width: 120px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
      border-radius: 6px;
      overflow: hidden;
    }
    
    .dropdown-menu button {
      width: 100%;
      padding: 10px 16px;
      text-align: left;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
    }
    
    .dropdown-menu button:hover {
      background-color: #2a2a2a;
    }
    
    .dropdown:hover .dropdown-menu {
      display: block;
    }
    
    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
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
      z-index: 1;
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
    
    .feature-wave {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
      z-index: -1;
    }
    
    .feature-card:hover .feature-wave {
      transform: scaleX(1);
    }
    
    .hero-image {
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      margin: 40px 0;
    }
    
    .hero-image img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.5s;
    }
    
    .hero-image:hover img {
      transform: scale(1.03);
    }
    
    @media (max-width: 768px) {
      .features {
        grid-template-columns: 1fr;
      }
      
      .feature-card {
        padding: 25px;
      }
    }
  </style>
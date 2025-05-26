<script>
  import { onMount } from 'svelte';
  import Profile from './Profile.svelte';
  import { createEventDispatcher } from 'svelte';

  let activeTab = 'feed';
  let isLoading = false;
  let profileError = '';
  let posts = [];
  let newPostContent = '';
  let newPostImage = null;
  let imagePreview = null;
  let commentInputs = {};
  
  export let onLogout;
  export let username = localStorage.getItem('username') || '';
  export let userPicture = localStorage.getItem('userPicture') || '';

  function extractUsernameFromEmail(email) {
    if (!email) return 'anonymous';
    return email.split('@')[0].replace(/\./g, '').toLowerCase();
  }

  function handleProfileUpdate(event) {
    username = event.detail.username;
    userPicture = event.detail.picture;
    localStorage.setItem('username', username);
    if (userPicture) {
      localStorage.setItem('userPicture', userPicture);
    }
  }


  onMount(() => {
    if (!username) {
      const email = localStorage.getItem('email');
      if (email) {
        username = extractUsernameFromEmail(email);
        localStorage.setItem('username', username);
      }
    }
    
    loadPosts();
  });

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  function loadPosts() {
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    posts = savedPosts.map(post => ({
      ...post,
      liked: post.likes && post.likes.includes(username),
      showComments: false
    }));
    
    commentInputs = {};
    posts.forEach(post => {
      commentInputs[post.id] = '';
    });
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      newPostImage = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async function createPost() {
    if (!username) {
      username = localStorage.getItem('username');
      
      if (!username) {
        const email = localStorage.getItem('email');
        if (email) {
          username = extractUsernameFromEmail(email);
          localStorage.setItem('username', username);
        } else {
          alert('Please set your username in profile first');
          return;
        }
      }
    }
    
    if (!newPostContent.trim() && !newPostImage) return;
    
    let imageBase64 = null;
    if (newPostImage) {
      try {
        imageBase64 = await fileToBase64(newPostImage);
      } catch (error) {
        console.error('Error converting image:', error);
      }
    }
    
    const newPost = {
      id: Date.now(),
      author: username,
      content: newPostContent,
      image: imageBase64,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      showComments: false
    };
    
    posts = [newPost, ...posts];
    commentInputs[newPost.id] = '';
    savePosts();
  
    newPostContent = '';
    newPostImage = null;
    imagePreview = null;
    // @ts-ignore
    document.getElementById('post-image').value = '';
  }

  function toggleLike(postId) {
    posts = posts.map(post => {
      if (post.id === postId) {
        const liked = !post.liked;
        let likes = [...(post.likes || [])];
        
        if (liked && !likes.includes(username)) {
          likes.push(username);
        } else if (!liked) {
          likes = likes.filter(login => login !== username);
        }
        
        return {
          ...post,
          likes,
          liked
        };
      }
      return post;
    });
    
    savePosts();
  }

  function toggleComments(postId) {
    posts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          showComments: !post.showComments
        };
      }
      return post;
    });
  }

  function addComment(postId) {
    if (!commentInputs[postId]?.trim()) return;
    
    posts = posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now(),
          author: username,
          content: commentInputs[postId],
          createdAt: new Date().toISOString()
        };
        
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });
    
    commentInputs[postId] = '';
    savePosts();
  }

  function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
      posts = posts.filter(post => post.id !== postId);
      delete commentInputs[postId];
      savePosts();
    }
  }

  function deleteComment(postId, commentId) {
    posts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(comment => comment.id !== commentId)
        };
      }
      return post;
    });
    savePosts();
  }

  function savePosts() {
    const postsToSave = posts.map(post => ({
      ...post,
      showComments: undefined,
      liked: undefined 
    }));
    localStorage.setItem('posts', JSON.stringify(postsToSave));
  }

  $: {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && storedUsername !== username) {
      username = storedUsername;
    }
    
    const storedPicture = localStorage.getItem('userPicture');
    if (storedPicture && storedPicture !== userPicture) {
      userPicture = storedPicture;
    }
  }
</script>

<header>
  <div class="logo">JoinUs</div>
  <nav>
    <button on:click={() => activeTab = 'feed'} class:active={activeTab === 'feed'}>Feed</button>
    <button on:click={() => activeTab = 'friends'} class:active={activeTab === 'friends'}>Chat</button>
    <button on:click={() => activeTab = 'profile'} class:active={activeTab === 'profile'}>Profile</button>
    <div class="dropdown">
      <button class="dropdown-toggle">
        {#if userPicture}
          <img src={userPicture} alt="User" class="user-avatar" />
        {:else}
          {username || 'Guest'}
        {/if}
      </button>
      <div class="dropdown-menu">
        <button on:click={onLogout}>Logout</button>
      </div>
    </div>
  </nav>
</header>

<main>
  {#if activeTab === 'feed'}
    {#if !username}
      <div class="profile-error">
        <p>Please set your username in profile before posting</p>
        <button on:click={() => activeTab = 'profile'}>Go to Profile</button>
      </div>
    {/if}
    
    <div class="create-post">
      <textarea 
        bind:value={newPostContent}
        placeholder="What's on your mind?"
        rows="3"
      ></textarea>
      
      <div class="post-actions">
        <label for="post-image" class="image-upload">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19,13a1,1,0,0,0-1,1v.38L16.52,12.9a2.79,2.79,0,0,0-3.93,0l-.7.7L9.41,11.12a2.85,2.85,0,0,0-3.93,0L4,12.6V7A1,1,0,0,1,5,6h7a1,1,0,0,0,0-2H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V15.43l2.9-2.9a.79.79,0,0,1,1.09,0l3.17,3.17,0,0L15.46,20Zm13-1a.89.89,0,0,1-.18.53L13.31,15l.7-.7a.77.77,0,0,1,1.1,0L18,17.22ZM22.71,4.29l-3-3a1,1,0,0,0-1.42,0l-3,3a1,1,0,0,0,0,1.42l3,3a1,1,0,0,0,1.42,0l3-3A1,1,0,0,0,22.71,4.29ZM19,5a1,1,0,1,1,1-1A1,1,0,0,1,19,5Z"/>
          </svg>
          Add Image
        </label>
        <input 
          id="post-image"
          type="file" 
          accept="image/*" 
          on:change={handleImageUpload}
          style="display: none;"
        >
        <button on:click={createPost} class:disabled={!newPostContent.trim() && !newPostImage}>
          Post
        </button>
      </div>
      
      {#if imagePreview}
        <div class="image-preview">
          <img src={imagePreview} alt="Preview">
          <button on:click={() => {
            newPostImage = null;
            imagePreview = null;
            // @ts-ignore
            document.getElementById('post-image').value = '';
          }}>×</button>
        </div>
      {/if}
    </div>
    
    <div class="posts-feed">
      {#each posts as post (post.id)}
        <div class="post">
          <div class="post-header">
            <div class="post-author">{post.author || 'anonymous'}</div>
            <div class="post-time">{new Date(post.createdAt).toLocaleString()}</div>
            {#if post.author === username}
              <button class="delete-post" on:click={() => deletePost(post.id)}>Delete</button>
            {/if}
          </div>
          
          {#if post.content}
            <div class="post-content">{post.content}</div>
          {/if}
          
          {#if post.image}
            <div class="post-image">
              <img src={post.image} alt="Post from {post.author}">
            </div>
          {/if}
          
          <div class="post-actions">
            <button 
              on:click={() => toggleLike(post.id)} 
              class:liked={post.liked}
            >
              ♥ {post.likes ? post.likes.length : 0}
            </button>
            <button on:click={() => toggleComments(post.id)}>
              💬 {post.comments ? post.comments.length : 0}
            </button>
          </div>
          
          {#if post.showComments}
            <div class="comments-section">
              <div class="add-comment">
                <input 
                  type="text" 
                  bind:value={commentInputs[post.id]}
                  placeholder="Write a comment..."
                  on:keydown={(e) => e.key === 'Enter' && addComment(post.id)}
                >
                <button on:click={() => addComment(post.id)}>Post</button>
              </div>
              
              {#each post.comments as comment (comment.id)}
                <div class="comment">
                  <div class="comment-header">
                    <span class="comment-author">{comment.author || 'anonymous'}</span>
                    <span class="comment-time">
                      {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    {#if comment.author === username}
                      <button 
                        class="delete-comment" 
                        on:click={() => deleteComment(post.id, comment.id)}
                      >
                        ×
                      </button>
                    {/if}
                  </div>
                  <div class="comment-content">{comment.content}</div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {:else}
        <div class="no-posts">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      {/each}
    </div>
    
  {:else if activeTab === 'friends'}
    <h2>Friends section is under development.</h2>
  {:else if activeTab === 'profile'}
    <Profile 
      currentUser={{ 
        login: username || 'anonymous', 
        picture: userPicture,
        bio: '' 
      }}
      on:profileUpdated={handleProfileUpdate}
    />
  {/if}
</main>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background-color: #121212;
    color: white;
  }

  .logo {
    font-size: 28px;
    font-weight: bold;
    color: #3b82f6;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  nav button {
    background-color: transparent;
    border: 1px solid #3b82f6;
    color: white;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }

  nav button.active,
  nav button:hover {
    background-color: #3b82f6;
    transform: translateY(-2px);
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
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
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
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .create-post {
    background: #1e1e1e;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid #333;
  }

  .create-post textarea {
    width: 100%;
    background: transparent;
    border: none;
    color: white;
    resize: none;
    font-family: inherit;
    font-size: 16px;
    margin-bottom: 10px;
  }

  .create-post textarea:focus {
    outline: none;
  }

  .post-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .image-upload {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #3b82f6;
    padding: 6px 12px;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .image-upload:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  .create-post button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }

  .create-post button:disabled {
    background: #555;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .image-preview {
    position: relative;
    margin-top: 15px;
  }

  .image-preview img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 4px;
  }

  .image-preview button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .posts-feed {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .post {
    background: #1e1e1e;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #333;
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
    align-items: center;
  }

  .post-author {
    font-weight: bold;
    color: #3b82f6;
  }

  .post-time {
    color: #777;
  }

  .delete-post {
    background: transparent;
    border: none;
    color: #ff6b6b;
    cursor: pointer;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .delete-post:hover {
    background: rgba(255, 0, 0, 0.1);
  }

  .post-content {
    margin-bottom: 15px;
    line-height: 1.5;
  }

  .post-image {
    margin-bottom: 15px;
  }

  .post-image img {
    max-width: 100%;
    max-height: 400px;
    border-radius: 4px;
  }

  .post-actions button {
    background: none;
    border: none;
    color: #777;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .post-actions button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .post-actions button.liked {
    color: #f43f5e;
  }

  .comments-section {
    margin-top: 15px;
    border-top: 1px solid #333;
    padding-top: 15px;
  }

  .add-comment {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }

  .add-comment input {
    flex-grow: 1;
    background: #2a2a2a;
    border: 1px solid #444;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
  }

  .add-comment button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0 12px;
    border-radius: 4px;
    cursor: pointer;
  }

  .comment {
    background: #2a2a2a;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    margin-bottom: 5px;
  }

  .comment-author {
    font-weight: bold;
    color: #3b82f6;
  }

  .comment-time {
    color: #777;
  }

  .delete-comment {
    background: transparent;
    border: none;
    color: #ff6b6b;
    cursor: pointer;
    margin-left: auto;
    padding: 0 4px;
  }

  .comment-content {
    font-size: 14px;
    line-height: 1.4;
  }

  .no-posts {
    text-align: center;
    padding: 40px;
    color: #777;
  }

  .profile-error {
    color: #ff6b6b;
    background: rgba(255, 0, 0, 0.1);
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
  }

  .profile-error button {
    margin-top: 10px;
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
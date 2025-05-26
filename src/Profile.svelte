<script>
  import { onMount, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let currentUser = { 
    login: localStorage.getItem('username') || '', 
    picture: localStorage.getItem('userPicture') || '', 
    bio: localStorage.getItem('bio') || '' 
  };

  let isEditing = false;
  let editedUser = {};
  let avatarFile = null;
  let avatarPreview = '';
  let isLoading = false;
  let usernameError = '';

  onMount(() => {
    loadProfile();
  });

  function loadProfile() {
    isLoading = true;
    currentUser = {
      login: localStorage.getItem('username') || currentUser.login,
      picture: localStorage.getItem('userPicture') || currentUser.picture,
      bio: localStorage.getItem('bio') || currentUser.bio
    };
    editedUser = {
      username: currentUser.login,
      bio: currentUser.bio
    };
    avatarPreview = currentUser.picture;
    isLoading = false;
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      avatarFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target.result === 'string') {
          avatarPreview = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function removeAvatar() {
    avatarPreview = '';
    avatarFile = null;
  }

  function checkUsernameUnique(username) {
    if (username === currentUser.login) {
      return true; // Текущий никнейм пользователя всегда валиден
    }
    
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const comments = posts.flatMap(post => post.comments || []);
    
    // Проверяем, используется ли никнейм в постах или комментариях
    const isUsedInPosts = posts.some(post => post.author === username);
    const isUsedInComments = comments.some(comment => comment.author === username);
    
    return !isUsedInPosts && !isUsedInComments;
  }

  function saveProfile() {
    usernameError = '';
    
    // Проверяем, изменился ли username
    if (editedUser.username !== currentUser.login) {
      if (!editedUser.username.trim()) {
        usernameError = 'Username cannot be empty';
        return;
      }
      
      if (!checkUsernameUnique(editedUser.username)) {
        usernameError = 'This username is already taken';
        return;
      }
    }
    
    localStorage.setItem('username', editedUser.username);
    localStorage.setItem('bio', editedUser.bio);
    if (avatarPreview) {
      localStorage.setItem('userPicture', avatarPreview);
    }

    currentUser = {
      login: editedUser.username,
      bio: editedUser.bio,
      picture: avatarPreview
    };

    isEditing = false;
    
    dispatch('profileUpdated', {
      username: editedUser.username,
      picture: avatarPreview
    });
  }

  function cancelEdit() {
    editedUser = {
      username: currentUser.login,
      bio: currentUser.bio
    };
    avatarPreview = currentUser.picture;
    avatarFile = null;
    isEditing = false;
    usernameError = '';
  }
</script>

<div class="profile-container">
  {#if !isLoading}
    {#if currentUser.login}
      {#if isEditing}
        <div class="profile-edit">
          <div class="avatar-upload">
            <div class="avatar-preview" style="background-image: url('{avatarPreview}')">
              {#if !avatarPreview}
                <div class="avatar-placeholder">{currentUser.login?.charAt(0).toUpperCase()}</div>
              {/if}
            </div>
            <label class="upload-button">
              Change Avatar
              <input type="file" accept="image/*" on:change={handleFileChange} style="display: none;">
            </label>
          </div>
          
          <div class="form-group">
            <label for="username-input">Username</label>
            <input 
              id="username-input" 
              type="text" 
              bind:value={editedUser.username} 
              class:error={usernameError}
            />
            {#if usernameError}
              <div class="error-message">{usernameError}</div>
            {/if}
          </div>
          
          <div class="form-group">
            <label for="bio-input">Bio</label>
            <textarea id="bio-input" bind:value={editedUser.bio}></textarea>
          </div>
          
          <div class="button-group">
            <button on:click={saveProfile} class="save-button">Save</button>
            <button on:click={cancelEdit} class="cancel-button">Cancel</button>
            {#if avatarPreview}
              <button on:click={removeAvatar} class="cancel-button">Remove Avatar</button>
            {/if}
          </div>
        </div>
      {:else}
        <div class="profile-view">
          <div class="avatar" style="background-image: url('{currentUser.picture}')">
            {#if !currentUser.picture}
              <div class="avatar-placeholder">{currentUser.login?.charAt(0).toUpperCase()}</div>
            {/if}
          </div>
          
          <h2>{currentUser.login}</h2>
          {#if currentUser.bio}
            <p class="bio">{currentUser.bio}</p>
          {/if}
          
          <button on:click={() => isEditing = true} class="edit-button">Edit Profile</button>
        </div>
      {/if}
    {:else}
      <p>User not found. Please log in.</p>
    {/if}
  {:else}
    <p>Loading profile...</p>
  {/if}
</div>

<style>
  .profile-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #1e1e1e;
    border-radius: 10px;
    color: white;
  }

  .profile-view, .profile-edit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .avatar, .avatar-preview {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    background-color: #3b82f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
    font-weight: bold;
    color: white;
    margin-bottom: 10px;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h2 {
    margin: 0;
    font-size: 28px;
  }

  .bio {
    max-width: 400px;
    text-align: center;
    line-height: 1.5;
    color: #aaa;
  }

  .edit-button, .save-button, .cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
  }

  .edit-button {
    background-color: #3b82f6;
    color: white;
  }

  .edit-button:hover {
    background-color: #2563eb;
  }

  .save-button {
    background-color: #10b981;
    color: white;
    margin-right: 10px;
  }

  .save-button:hover {
    background-color: #059669;
  }

  .cancel-button {
    background-color: #6b7280;
    color: white;
  }

  .cancel-button:hover {
    background-color: #4b5563;
  }

  .form-group {
    width: 100%;
    max-width: 400px;
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #aaa;
  }

  .form-group input, .form-group textarea {
    width: 100%;
    padding: 10px;
    background: #2c2c2c;
    border: 1px solid #444;
    border-radius: 5px;
    color: white;
  }

  .form-group input.error {
    border-color: #f43f5e;
  }

  .error-message {
    color: #f43f5e;
    font-size: 14px;
    margin-top: 5px;
  }

  .form-group textarea {
    height: 100px;
    resize: vertical;
  }

  .upload-button {
    display: inline-block;
    padding: 8px 15px;
    background: #3b82f6;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .upload-button:hover {
    background: #2563eb;
  }

  .button-group {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }
</style>

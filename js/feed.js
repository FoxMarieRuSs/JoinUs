export function renderFeed() {
    document.getElementById("feed").style.display = "block";
    document.querySelector("main").style.display = "none";
  
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postsList = document.getElementById("postsList");
    
    postsList.innerHTML = posts.map(post => `
      <div class="post-card" data-id="${post.id}">
        <div class="post-header">
          <div class="post-avatar">${post.author.charAt(0).toUpperCase()}</div>
          <div class="post-author">${post.author}</div>
        </div>
        <div class="post-content">${post.text}</div>
        ${post.image ? `<img src="${post.image}" class="post-image">` : ''}
        <div class="post-actions">
          <button class="like-btn">❤️ ${post.likes || 0}</button>
          <button class="comment-btn">💬 ${post.comments || 0}</button>
        </div>
      </div>
    `).join('');
  
    postsList.addEventListener("click", (e) => {
      if (e.target.classList.contains("like-btn")) {
        const postId = parseInt(e.target.closest(".post-card").dataset.id);
        likePost(postId);
      }
    });
  }
  
  function likePost(postId) {
    const posts = JSON.parse(localStorage.getItem("posts"));
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      localStorage.setItem("posts", JSON.stringify(posts));
      renderFeed();
    }
  }
  
  export function initPostCreation() {
    document.getElementById("addImageBtn").addEventListener("click", () => {
      document.getElementById("postImage").click();
    });
  
    document.getElementById("publishPostBtn").addEventListener("click", () => {
      const text = document.getElementById("postText").value.trim();
      if (!text) return alert("Введите текст поста");
  
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
  
      const newPost = {
        id: Date.now(),
        author: currentUser.login,
        text: text,
        likes: 0,
        comments: 0,
        image: ""
      };
  
      posts.unshift(newPost);
      localStorage.setItem("posts", JSON.stringify(posts));
      renderFeed();
      document.getElementById("postText").value = "";
    });
  }
  
  if (!localStorage.getItem("posts")) {
    localStorage.setItem("posts", JSON.stringify([
      {
        id: 1,
        author: "Иван",
        text: "Привет! Это мой первый пост!",
        likes: 5,
        comments: 2
      },
      {
        id: 2,
        author: "Мария",
        text: "Делюсь своим настроением 😊",
        likes: 12,
        comments: 4
      }
    ]));
  }
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

document.getElementById('new-post-content').addEventListener('input', function() {
    autoResizeTextarea(this);
});

function createNewPost() {
    const title = document.getElementById('new-post-title').value;
    const content = document.getElementById('new-post-content').value;

    if (title && content) {
        const postContainer = document.getElementById('posts-container');
        const emptyFeedMessage = document.getElementById('empty-feed-message');
        if (emptyFeedMessage) {
            postContainer.removeChild(emptyFeedMessage);
        }

        const newPost = document.createElement('div');
        newPost.className = 'post';

        const postTitle = document.createElement('h3');
        postTitle.className = 'post-title';
        postTitle.textContent = title;

        const postContent = document.createElement('p');
        postContent.className = 'post-content';
        postContent.textContent = content;

        const commentSection = document.createElement('div');
        commentSection.className = 'comment-section';

        const commentHeading = document.createElement('h4');
        commentHeading.textContent = 'Comments';
        commentSection.appendChild(commentHeading);

        const commentInput = document.createElement('textarea');
        commentInput.className = 'input comment-input';
        commentInput.placeholder = 'Enter your comment';

        const commentButton = document.createElement('button');
        commentButton.className = 'comment-button';
        commentButton.textContent = 'Comment';
        commentButton.onclick = function() {
            addComment(commentSection, commentInput.value);
            commentInput.value = '';
        };

        const showCommentsButton = document.createElement('button');
        showCommentsButton.className = 'comment-button';
        showCommentsButton.textContent = 'Show Comments';
        showCommentsButton.onclick = function() {
            if (commentSection.style.display === 'none' || commentSection.style.display === '') {
                commentSection.style.display = 'block';
                showCommentsButton.textContent = 'Hide Comments';
            } else {
                commentSection.style.display = 'none';
                showCommentsButton.textContent = 'Show Comments';
            }
        };

        commentSection.appendChild(commentInput);
        commentSection.appendChild(commentButton);

        newPost.appendChild(postTitle);
        newPost.appendChild(postContent);
        newPost.appendChild(showCommentsButton);
        newPost.appendChild(commentSection);
        postContainer.insertBefore(newPost, postContainer.children[1]);

        document.getElementById('new-post-title').value = '';
        document.getElementById('new-post-content').value = '';
        autoResizeTextarea(document.getElementById('new-post-content'));
    } else {
        alert('Please enter both title and content for the post.');
    }
}

function addComment(commentSection, commentText) {
    if (commentText) {
        const comment = document.createElement('p');
        comment.className = 'comment';
        comment.textContent = commentText;
        commentSection.insertBefore(comment, commentSection.children[commentSection.children.length - 2]);
    } else {
        alert('Please enter a comment.');
    }
}

function toggleMode() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('mode', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

function toggleSidebar() {
    const sidebarContainer = document.querySelector('.sidebar-container');
    sidebarContainer.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', (event) => {
    const mode = localStorage.getItem('mode');
    if (mode === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('mode-toggle').checked = true;
    }
});
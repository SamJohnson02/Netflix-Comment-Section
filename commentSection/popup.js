document.addEventListener('DOMContentLoaded', function() {
  // Add event listener to the "Add Comment" button
  document.getElementById('addCommentButton').addEventListener('click', handleAddCommentClick);

  // Add event listener to input field to detect Enter key press
  document.getElementById("enterComments").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
          event.preventDefault(); // Prevent the default Enter key behavior
          handleAddCommentClick();
      }
  });

  function deleteComments() {
    // Remove comments from local storage
    localStorage.removeItem("comments");
  
    // Remove comments from the UI
    var commentsList = document.getElementById("commentsList");
    commentsList.innerHTML = ''; // Clear comments from UI
  
    // Reload the extension popup window
    window.location.reload();
  }

  // Load existing comments from localStorage
  loadComments();

  // Add event listener to the "Go to Netflix" button
  document.getElementById('goToNetflixButton').addEventListener('click', goToNetflix);
  document.getElementById('deleteComments').addEventListener('click', deleteComments );

});


function handleAddCommentClick() {
  var commentInput = document.getElementById('commentInput');
  var commentText = commentInput.value.trim();

  if (commentText !== '') {
      addComment(commentText);
      saveComments();
      commentInput.value = '';
      commentInput.focus();
  } else {
      alert('Please enter a comment before adding.');
  }
}

function addComment(comment) {
  var commentsList = document.getElementById("commentsList");
  var li = document.createElement("li");
  li.textContent = comment;
  commentsList.appendChild(li);
}

function saveComments() {
  var comments = Array.from(document.getElementById("commentsList").children).map(function(commentElement) {
      return commentElement.textContent;
  });
  localStorage.setItem("comments", JSON.stringify(comments));
}

function loadComments() {
  var comments = JSON.parse(localStorage.getItem("comments")) || [];
  var commentsList = document.getElementById("commentsList");
  comments.forEach(function(comment) {
      addComment(comment);
  });
}

function goToNetflix() {
  // Create a new window in the same screen
  chrome.windows.getCurrent(null, function(currentWindow) {
      chrome.windows.create({
          url: 'https://www.netflix.com/',
          left: currentWindow.left, // Position the window to the left of the current window
          top: currentWindow.top, // Position the window at the same top position as the current window
          width: currentWindow.width / 2, // Set the width to half of the current window's width
          height: currentWindow.height, // Maintain the same height as the current window
          type: 'normal'
      });
      // Resize the current window
      chrome.windows.update(currentWindow.id, {
          width: currentWindow.width / 2 // Set the width to half of the current window's width
      });
  });
}

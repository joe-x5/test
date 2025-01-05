// Firebase Initialization (already included in your app)
const firebaseConfig = {
  apiKey: "AIzaSyCE5gLp99K4IUq6V-BhlmgOcTtTjjG6WpU",
  authDomain: "chat-app-9d3d2.firebaseapp.com",
  databaseURL: "https://chat-app-9d3d2-default-rtdb.firebaseio.com",
  projectId: "chat-app-9d3d2",
  storageBucket: "chat-app-9d3d2.firebasestorage.app",
  messagingSenderId: "110218700281",
  appId: "1:110218700281:web:470b92a7e4b223a0660928",
  measurementId: "G-PZKV7JTD5K"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM Elements
const joinContainer = document.getElementById('join-container');
const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const generateCodeBtn = document.getElementById('generate-code-btn');
const joinCodeInput = document.getElementById('join-code-input');
const joinChatBtn = document.getElementById('join-chat-btn');
const worldChatBtn = document.getElementById('world-chat-btn'); // World Chat button
const sendBtn = document.getElementById('send-btn');
const leaveChatBtn = document.getElementById('leave-chat-btn');
const softKeysContainer = document.getElementById("softKeysContainer");
const typingIndicator = document.getElementById('typing-indicator'); // 
let currentRoom = null;
let userName = '';
let isCodeGenerator = false;

// Sharp colors for each user
const sharpColors = ["#ff0000", "#0000ff", "#00ff00", "#ff00ff", "#ffa500", "#800080"];
const randomColor = () => sharpColors[Math.floor(Math.random() * sharpColors.length)];
let userColor = randomColor();

// Function to generate chat code
function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Prompt for user name, only if not already set
function promptUserName() {
  // Check if the name is already saved in localStorage
  const savedName = localStorage.getItem('userName');
  
  if (savedName) {
    // If name exists in storage, use it
    userName = savedName;
    alert(`Welcome back, ${userName}!`);
  } else {
    // Otherwise, prompt the user to enter their name
    let userInput = prompt(" ���𠺪�� Enter your name (max 30 letters ):");
    if (userInput && userInput.length <= 30) {
      userName = userInput;
      localStorage.setItem('userName', userName); // Save the name in localStorage
      alert(`Your name is set as: ${userName}`);
    } else {
      alert("Enter ��㵪�� a valid name �鴂蛤��娬�麯 with a maximum of 30 letters.");
      promptUserName(); // Re-prompt if the input is invalid
    }
  }
}

// Call this function once when the user joins the chat
promptUserName();

// Prompt user for name as soon as the page loads
window.addEventListener('load', promptUserName);

// Display join container initially
joinContainer.style.display = 'block';

// Function to show KaiAd
function showKaiAd() {
    getKaiAd({
        publisher: 'da08737d-861e-4ebe-bbbb-8fb90d004d39',
        app: 'Chit_Chat',
        slot: 'Chit_Chat__slot',
        onerror: err => console.error('Custom catch:', err),
        onready: ad => {
            // Store the currently focused element before the ad is displayed
            previouslyFocusedElement = document.activeElement;

            // Ad is ready to be displayed
            ad.call('display');
            
            ad.on('display', () => {
                // Hide the softKeysContainer when the ad is displayed
                document.getElementById("softKeysContainer").style.display = "none";
            });

            ad.on('close', () => {
                // Automatically focus on the "Send" button after the ad is closed
                document.getElementById('send-btn').focus();
            });
        }
    });
}

// Display ad every 2 minutes
setInterval(showKaiAd, 2 * 60 * 1000); // 2 minutes interval

// Generate chat code button
generateCodeBtn.addEventListener('click', () => {
  currentRoom = generateCode();
  isCodeGenerator = true;
  alert(`Your chat code: ${currentRoom}`);
  joinChat();
  showKaiAd(); // Show ad on chat join
});

// Join chat button
joinChatBtn.addEventListener('click', () => {
  const code = joinCodeInput.value.trim();
  if (code) {
    currentRoom = code;
    isCodeGenerator = false;
    joinChat();
    showKaiAd(); // Show ad on chat join
  } else {
    alert('Please enter a valid code.');
  }
});

// World Chat button event listener (no code required)
worldChatBtn.addEventListener('click', () => {
  currentRoom = "world_chat";
  isCodeGenerator = false;
  joinChat();
  showKaiAd(); // Show ad on joining world chat
});

// Join chat and hide join container
function joinChat() {
  joinContainer.style.display = 'none';
  chatContainer.style.display = 'flex';
  loadMessages();
monitorTyping();
  displayUserJoined();
  messageInput.focus();
  displayUserJoined();
  alert("Use 2儭謿�� and 8儭謿�� keys ���嘅�� to scroll chat up and down");
}

// Display "user has joined" message to all users
function displayUserJoined() {
  const message = `${userName} has joined the chat.`;
  const chatMessage = {
    text: message,
    timestamp: new Date().toISOString(),
    type: 'join',
    userColor: userColor
  };
  database.ref(`chats/${currentRoom}`).push(chatMessage);
}
// Typing status
let isTyping = false;
let typingTimeout;
const typingRef = database.ref(`typingStatus/${currentRoom}`);
// Listen for messages in the current room
function loadMessages() {
  const roomRef = database.ref(`chats/${currentRoom}`).limitToLast(10);
  roomRef.off(); // Stop previous listeners when joining new room
  roomRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    displayMessage(message);
  });
}

// Send message event
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Send message function
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText) {
    const chatMessage = {
      text: messageText,
      timestamp: new Date().toISOString(),
      userName: userName,
      userColor: userColor
    };
    database.ref(`chats/${currentRoom}`).push(chatMessage);
    messageInput.value = ''; // Clear input field
setTypingStatus(false); // Stop typing when message is sent
    messageInput.focus(); // Refocus on message input
  }
}
// Typing status monitoring
messageInput.addEventListener('input', () => {
  if (!isTyping) {
    isTyping = true;
    setTypingStatus(true);
  }
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    isTyping = false;
    setTypingStatus(false);
  }, 2000); // Timeout for typing status
});
// Function to display messages (including images)
function displayMessage(message) {
  const messageElement = document.createElement('p');

  if (message.type === 'join') {
    messageElement.textContent = message.text;
    messageElement.style.color = "#ff9800";
    messageElement.style.fontWeight = 'bold';
  } else {
    const nameSpan = document.createElement('span');
    nameSpan.textContent = `${message.userName || 'Anonymous'}: `;
    nameSpan.style.color = message.userColor;
    nameSpan.style.fontWeight = 'bold';
    messageElement.appendChild(nameSpan);

    // Check if the message contains an image URL (base64)
    if (message.imageURL) {
      const imageElement = document.createElement('img');
      imageElement.src = message.imageURL; // Set image source to the URL from ImageBB
      imageElement.style.maxWidth = '100px'; // Adjust image size as needed
      messageElement.appendChild(imageElement);
    } else {
      messageElement.appendChild(document.createTextNode(message.text));
    }
  }

  chatBox.appendChild(messageElement); // Add the message to the chat box
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat
}

// Function to show a confirmation prompt when pressing SoftRight
document.addEventListener('keydown', (event) => {
  if (event.key === 'Backspace') {
    event.preventDefault(); // Prevent the default backspace action

    // Leave chat functionality
    displayUserLeft(); // Show "has left the chat" message
    currentRoom = null;
    chatBox.innerHTML = ''; // Clear chat box
    joinContainer.style.display = 'block'; // Show join container
    chatContainer.style.display = 'none';  // Hide chat container
    typingRef.remove(); // Remove typing status on leave

    // Move focus to the first element in the join container
    const firstJoinElement = document.querySelector('#join-code-input'); // Set to your preferred focusable element
    if (firstJoinElement) {
      firstJoinElement.focus();  // Set focus to the input for chat code
    }

    showKaiAd(); // Show ad on leaving chat

    // Show soft keys again when Backspace is pressed
    document.getElementById("softKeysContainer").style.display = "block";
  }

  if (event.key === 'SoftRight') {
    event.preventDefault(); // Prevent default action

    // Display confirmation dialog for closing the app
    const confirmClose = confirm('Do you want to close the app?');
    if (confirmClose) {
      window.close(); // Close the app if confirmed
    }
  }
});

// Hide soft keys when specific buttons are pressed
document.getElementById("generate-code-btn").addEventListener('click', () => {
  document.getElementById("softKeysContainer").style.display = "none"; // Hide soft keys
});

document.getElementById("join-chat-btn").addEventListener('click', () => {
  document.getElementById("softKeysContainer").style.display = "none"; // Hide soft keys
});

document.getElementById("world-chat-btn").addEventListener('click', () => {
  document.getElementById("softKeysContainer").style.display = "none"; // Hide soft keys
});

// When soft keys are hidden, show them again if backspace is pressed
document.addEventListener('keydown', (event) => {
  if (event.key === 'Backspace') {
    // Show soft keys again when backspace is pressed
    document.getElementById("softKeysContainer").style.display = "block";
  }
});

// Function to scroll the chatbox up or down
function scrollChatbox(direction) {
  const scrollAmount = direction === 'down' ? 50 : -50;
  chatBox.scrollBy(0, scrollAmount);
}

// Function to handle navigation between input elements (focusable items)
function nav(move) {
  const currentIndex = document.activeElement;
  const items = document.querySelectorAll('.navItem');
  let currentElemIdx = [...items].indexOf(currentIndex);
  const next = currentElemIdx + move;
  let targetElement = items[next];
  if (targetElement) targetElement.focus();
}

// Function to handle navigation between input elements (focusable items)
function nav(move) {
  const items = document.querySelectorAll('.navItem');
  let currentElemIdx = [...items].indexOf(document.activeElement);
  
  // Calculate the next index to move to
  const nextIndex = currentElemIdx + move;

  // Ensure the next index is within bounds
  if (nextIndex >= 0 && nextIndex < items.length) {
    items[nextIndex].focus();
  }
}

// Keyboard navigation and scroll event listeners
document.addEventListener('keydown', (e) => {
  const joinCodeInputFocused = document.activeElement === joinCodeInput;

  if (joinCodeInputFocused) {
    // Handle numeric input in joinCodeInput field
    if (e.key >= '0' && e.key <= '9') {
      // Allow only numeric input
      e.preventDefault();
      joinCodeInput.value += e.key;
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      // Enable navigation even when joinCodeInput is focused
      const move = e.key === 'ArrowDown' ? 1 : -1;
      nav(move);
      e.preventDefault();
    }
  } else {
    // Handle scrolling and navigation when joinCodeInput is not focused
    if (e.key === '2') {
      scrollChatbox('up'); // Scroll up when key '2' is pressed
      e.preventDefault();
    } else if (e.key === '8') {
      scrollChatbox('down'); // Scroll down when key '8' is pressed
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      nav(1); // Navigate to the next item using the down arrow
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      nav(-1); // Navigate to the previous item using the up arrow
      e.preventDefault();
    }
  }
});

// Clear last character in joinCodeInput field if the backspace key is pressed
joinCodeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace') {
    e.preventDefault();
    joinCodeInput.value = joinCodeInput.value.slice(0, -1);
  }
});
// Display "user has left" message when leaving
function displayUserLeft() {
  const message = `${userName} has left the chat.`;
  const chatMessage = {
    text: message,
    timestamp: new Date().toISOString(),
    type: 'leave',
    userColor: userColor
  };
  database.ref(`chats/${currentRoom}`).push(chatMessage);
}

// Listen for users typing
function monitorTyping() {
  typingRef.on('value', (snapshot) => {
    const typingData = snapshot.val();
    if (typingData && typingData.name !== userName) {
      typingIndicator.innerText = `${typingData.name} is typing...`;
    } else {
      typingIndicator.innerText = ''; // Clear indicator if no one is typing
    }
  });
}

// Function to show user typing status
function setTypingStatus(isUserTyping) {
  if (isUserTyping) {
    typingRef.set({ name: userName });
  } else {
    typingRef.remove();
  }
}


// Set focus to the first navigable element on page load
window.addEventListener('load', () => {
  const firstButton = document.querySelector('.navItem');
  if (firstButton) firstButton.focus();
});
// ImageBB API Key
const imageBBApiKey = '65f269399bbac0cf4fa69d8f4a0345d5';

// Create an overlay for upload progress
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
overlay.style.color = 'white';
overlay.style.display = 'flex';
overlay.style.alignItems = 'center';
overlay.style.justifyContent = 'center';
overlay.style.fontSize = '20px';
overlay.style.zIndex = '1000';
overlay.style.display = 'none';
document.body.appendChild(overlay);

document.getElementById('image-input-btn').addEventListener('click', () => {
  document.getElementById('image-input').click();
});

document.getElementById('image-input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Convert the file to Base64 for ImageBB API
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const base64Image = reader.result.split(',')[1];
    
    // Use XMLHttpRequest for API request
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.imgbb.com/1/upload?key=${imageBBApiKey}`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Show overlay and initialize progress text
    overlay.style.display = 'flex';
    overlay.textContent = 'Uploading Image... 0%';

    // Update overlay text with upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        overlay.textContent = `Uploading Image... ${percentComplete}%`;
      }
    };

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        overlay.style.display = 'none'; // Hide overlay when upload is complete

        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            const imageUrl = response.data.url;

            // Optional: Send the image URL to Firebase
            const message = {
              imageURL: imageUrl, // Store the image URL in the message
              timestamp: new Date().toISOString(),
              userName: userName,
              userColor: userColor
            };

            // Send the message to Firebase (or another chat database)
            database.ref(`chats/${currentRoom}`).push(message);

            // Display the image in the chat only for other users
            if (!isCurrentUser) {
              displayMessage(message);
            }
          } else {
            alert("Image upload failed. Please try again.");
          }
        } else {
          alert("Image upload failed. Please check your network connection.");
        }
      }
    };

    // Send base64 image data in the required format
    xhr.send(`image=${encodeURIComponent(base64Image)}`);
  };
});

// Function to display messages, including images, in the chat
function displayMessage(message) {
  const messageElement = document.createElement('p');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = `${message.userName || ''}: `;
  nameSpan.style.color = message.userColor;
  nameSpan.style.fontWeight = 'bold';
  messageElement.appendChild(nameSpan);

  // Check if the message contains an image URL
  if (message.imageURL) {
    const imageElement = document.createElement('img');
    imageElement.src = message.imageURL; // Set image source to the URL from ImageBB
    imageElement.style.maxWidth = '100px'; // Adjust image size if necessary
    messageElement.appendChild(imageElement);
  } else {
    messageElement.appendChild(document.createTextNode(message.text));
  }

  chatBox.appendChild(messageElement); // Add the message to the chat box
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat
}

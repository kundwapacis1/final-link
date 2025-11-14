const SERVER_IP = ' 172.31.220.18'; // <- replace with your LAN IP
const socket = io(`http://${SERVER_IP}:5000`);

const roomInput = document.getElementById('room');
const joinBtn = document.getElementById('joinBtn');
const messagesDiv = document.getElementById('messages');
const sendBtn = document.getElementById('sendBtn');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');

const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileList = document.getElementById('files');

let currentRoom = 'lobby';

// --- Join room
joinBtn.onclick = async () => {
  currentRoom = roomInput.value.trim() || 'lobby';
  socket.emit('join-room', currentRoom);
  await fetchTexts();
  await fetchFiles();
};

// --- Send chat message
sendBtn.onclick = async () => {
  const sender = nameInput.value.trim() || 'Anonymous';
  const content = messageInput.value.trim();
  if (!content) return;

  socket.emit('chat-message', { room: currentRoom, sender, message: content });
  addMessage('You', content);

  await fetch(`http://${SERVER_IP}:5000/api/text/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, content, room: currentRoom })
  });

  messageInput.value = '';
};

// --- Receive text via socket
socket.on('chat-message', (data) => {
  addMessage(data.sender, data.message);
});

// --- Fetch chat history
async function fetchTexts() {
  const res = await fetch(`http://${SERVER_IP}:5000/api/text/list?room=${currentRoom}`);
  const texts = await res.json();
  messagesDiv.innerHTML = '';
  texts.reverse().forEach(t => addMessage(t.sender, t.content));
}

// --- Upload file
uploadBtn.onclick = async () => {
  if (!fileInput.files.length) return alert('Select a file');

  const form = new FormData();
  form.append('file', fileInput.files[0]);

  const res = await fetch(`http://${SERVER_IP}:5000/api/files/upload`, {
    method: 'POST',
    body: form
  });

  const fileMeta = await res.json();
  socket.emit('file-shared', { room: currentRoom, ...fileMeta });
  addFile(fileMeta.originalName, `http://${SERVER_IP}:5000${fileMeta.url}`);
  fileInput.value = '';
};

// --- Receive file via socket
socket.on('file-shared', (file) => {
  addFile(file.originalName, `http://${SERVER_IP}:5000${file.url}`);
});

// --- Fetch files list
async function fetchFiles() {
  const res = await fetch(`http://${SERVER_IP}:5000/api/files/list?room=${currentRoom}`);
  const files = await res.json();
  fileList.innerHTML = '';
  files.forEach(f => addFile(f.originalName, `http://${SERVER_IP}:5000${f.url}`));
}

// --- Helper functions
function addMessage(sender, message) {
  const div = document.createElement('div');
  div.textContent = `${sender}: ${message}`;
  messagesDiv.prepend(div);
}

function addFile(name, url) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = url;
  a.textContent = name;
  a.download = name;
  li.appendChild(a);
  fileList.prepend(li);
}

// --- Load initial data
fetchTexts();
fetchFiles();

const socket = io();


joinBtn.onclick = () => {
room = roomInput.value || 'lobby';
socket.emit('join-room', room);
appendMessage(`Joined room: ${room}`);
loadFiles();
};


sendBtn.onclick = () => {
const payload = { room, name: nameInput.value || 'anon', message: messageInput.value };
socket.emit('chat-message', payload);
appendMessage(`You: ${payload.message}`);
messageInput.value = '';
};


socket.on('chat-message', (p) => {
appendMessage(`${p.name}: ${p.message}`);
});


socket.on('file-shared', (p) => {
appendMessage(`New file shared: ${p.originalName}`);
loadFiles();
});


function appendMessage(text) {
const el = document.createElement('div');
el.textContent = text;
messagesDiv.prepend(el);
}


uploadBtn.onclick = async () => {
if (!fileInput.files.length) return alert('Choose a file');
const f = fileInput.files[0];
const form = new FormData();
form.append('file', f);
const res = await fetch('/api/upload', { method: 'POST', body: form });
if (!res.ok) return alert('Upload failed');
const meta = await res.json();
// notify others in room
socket.emit('file-shared', { room, ...meta });
appendMessage(`Uploaded: ${meta.originalName}`);
loadFiles();
};


async function loadFiles() {
const res = await fetch('/api/files');
if (!res.ok) return;
const arr = await res.json();
fileList.innerHTML = '';
arr.forEach(f => {
const li = document.createElement('li');
const a = document.createElement('a');
a.href = `/files/${f.path}`;
a.textContent = `${f.originalName} (${Math.round(f.size/1024)} KB)`;
a.setAttribute('download', f.originalName);
li.appendChild(a);
fileList.appendChild(li);
});
}


// Auto-join default roo
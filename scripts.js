const gifts = [
  { id: 1, name: "Camisetas manga sisa (Semanarios) + 3 pañales etapa 0" },
  { id: 2, name: "Camisetas manga corta + 3 pañales etapa 1" },
  { id: 3, name: "Camisetas manga larga + 3 pañales etapa 2" },
  { id: 4, name: "Bodies manga corta + 3 pañales etapa 3" },
  { id: 5, name: "Bodies manga larga + 3 pañales etapa 2" },
  { id: 6, name: "Saco para dormir + 3 pañales etapa 2" },
  { id: 7, name: "Sudadera + 3 pañales etapa 2" },
  { id: 8, name: "Kit Medias pantalón + 3 pañales etapa 3" },
  { id: 9, name: "Juguete didático + 3 pañales etapa 2" },
  { id: 10, name: "Vestido + 3 pañales etapa 3" },
  { id: 11, name: "Conjuntos para bebé + 3 pañales etapa 4" },
  { id: 12, name: "Jeans - pantalón + 3 pañales etapa 4" },
  { id: 13, name: "Toalla de bebé + 3 pañales etapa 4" },
  { id: 14, name: "Mameluco + 3 pañales etapa 4" },
  { id: 15, name: "Saco + 3 pañales etapa 2" },
  { id: 16, name: "Chaqueta + 3 pañales etapa 2" },
  { id: 17, name: "Tina + 3 pañales etapa 2" },
  { id: 18, name: "Teteros anti reflujo + 3 pañales etapa 2" },
  { id: 19, name: "Vasito entrenador + mordedores + 3 pañales etapa 0" },
  { id: 20, name: "Juguete de estimulación + 3 pañales etapa 1" },
  { id: 21, name: "Esterilizador teteros + 3 pañales etapa 1" },
  { id: 22, name: "Juguetes de contraste (blanco y negro) + 3 pañales etapa 1" },
  { id: 23, name: "Cuna colecho + 3 pañales etapa 1" },
  { id: 24, name: "Crema para el rabito, crema para el cuerpo + 3 pañales etapa 3" },
  { id: 25, name: "Juego de sabanas para colecho + 3 pañales etapa 3" },
  { id: 26, name: "Aspirador nasal tipo tubo (sacamocos) + 3 pañales etapa 3" },
  { id: 27, name: "Baberos y toallitas de tela o microfibra + 3 pañales etapa 3" },
  { id: 28, name: "Kit johnsons baño recién nacido + 3 pañales etapa 3" },
  { id: 29, name: "Vajilla para bebé + 3 pañales etapa 3" },
  { id: 30, name: "Termómetro + pañitos húmedos" },
  { id: 31, name: "Cortaúñas eléctrico para bebé + 3 pañales etapa 3" },
  { id: 32, name: "Cambiador + 3 pañales etapa 3" },
  { id: 33, name: "Pañitos húmedos + chupetes + 3 pañales etapa 2" },
  { id: 34, name: "Fular o Canguro + 3 pañales etapa 3" }
];

const assignedUsers = []; // Lista de personas que ya participaron
const adminPassword = "admin123"; // Contraseña para reiniciar

let isSpinning = false;
let currentRotation = 0;
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const numSegments = gifts.length;
const segmentAngle = (2 * Math.PI) / numSegments;
const arrowOffset = segmentAngle / 2;

function drawWheel() {
  for (let i = 0; i < numSegments; i++) {
    const angle = segmentAngle * i;
    ctx.beginPath();
    ctx.moveTo(200, 200);  // Cambiar el centro del canvas
    ctx.arc(200, 200, 200, angle, angle + segmentAngle);
    ctx.fillStyle = i % 2 === 0 ? "#f7b731" : "#eb3b5a";
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(200, 200);  // Cambiar el centro del texto
    ctx.rotate(angle + segmentAngle / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Arial";
    ctx.fillText(gifts[i].id, 140, 10);
    ctx.restore();
  }
}

function spinWheel() {
  const name = document.getElementById('name').value;

  if (assignedUsers.includes(name)) {
    alert("Esta persona ya ha jugado.");
    return;
  }

  if (!name) {
    alert("Por favor ingresa tu nombre.");
    return;
  }

  const remainingGifts = gifts.filter(gift => !gift.ticked);
  if (remainingGifts.length === 0) {
    alert("Todos los regalos ya han sido seleccionados.");
    return;
  }

  isSpinning = true;

  const randomIndex = Math.floor(Math.random() * remainingGifts.length);
  const gift = remainingGifts[randomIndex];
  const spins = Math.floor(Math.random() * 360) + 720;
  const finalAngle = spins + (360 - (randomIndex * (360 / numSegments))) - (arrowOffset * (180 / Math.PI));
  currentRotation += finalAngle;

  canvas.style.transition = "transform 4s cubic-bezier(0.1, 0.7, 0.2, 1)";
  canvas.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    gift.ticked = true;
    assignedUsers.push(name);
    const assignedGifts = JSON.parse(localStorage.getItem('assignedGifts')) || [];
    assignedGifts.push({ name, gift });
    localStorage.setItem('assignedGifts', JSON.stringify(assignedGifts));

    document.getElementById('result').innerText = `¡Regalo asignado: #${gift.id} - ${gift.name}!`;
    updateGiftList();
    updateAssignedGiftsList();
    isSpinning = false;
  }, 4000);
}

function updateGiftList() {
  const giftList = document.getElementById('giftList');
  giftList.innerHTML = '';

  gifts.forEach(gift => {
    const li = document.createElement('li');
    li.textContent = `#${gift.id} ${gift.name}`;
    if (gift.ticked) {
      li.classList.add('ticked');
    }
    giftList.appendChild(li);
  });
}

function updateAssignedGiftsList() {
  const assignedGifts = JSON.parse(localStorage.getItem('assignedGifts')) || [];
  const list = document.getElementById('assignedGifts');
  list.innerHTML = '';

  assignedGifts.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name} ha recibido el regalo #${entry.gift.id}: ${entry.gift.name}.`;
    list.appendChild(li);
  });
}

function requestPassword() {
  document.getElementById('passwordModal').style.display = "block";
}

function closeModal() {
  document.getElementById('passwordModal').style.display = "none";
}

function resetGifts() {
  const password = document.getElementById('admin-password').value;
  if (password === adminPassword) {
    localStorage.clear();
    location.reload();
  } else {
    alert("Contraseña incorrecta.");
  }
}

// Inicializar la ruleta al cargar la página
window.onload = () => {
  drawWheel();
  updateGiftList();
  updateAssignedGiftsList();
};

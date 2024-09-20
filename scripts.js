// Configuración Firebase
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const gifts = [
  { name: "Camisetas manga sisa (Semanarios) + 3 pañales etapa 0" },
  { name: "Camisetas manga corta + 3 pañales etapa 1" },
  { name: "Camisetas manga larga + 3 pañales etapa 2" },
  { name: "Bodies manga corta + 3 pañales etapa 3" },
  { name: "Bodies manga larga + 3 pañales etapa 2" },
  { name: "Saco para dormir + 3 pañales etapa 2" },
  { name: "Sudadera + 3 pañales etapa 2" },
  { name: "Kit Medias pantalón + 3 pañales etapa 3" },
  { name: "Juguete didático + 3 pañales etapa 2" },
  { name: "Vestido + 3 pañales etapa 3" },
  { name: "Conjuntos para bebé + 3 pañales etapa 4" },
  { name: "Jeans - pantalón + 3 pañales etapa 4" },
  { name: "Toalla de bebé + 3 pañales etapa 4" },
  { name: "Mameluco + 3 pañales etapa 4" },
  { name: "Saco + 3 pañales etapa 2" },
  { name: "Chaqueta + 3 pañales etapa 2" },
  { name: "Tina + 3 pañales etapa 2" },
  { name: "Teteros anti reflujo + 3 pañales etapa 2" },
  { name: "Vasito entrenador + mordedores + 3 pañales etapa 0" },
  { name: "Juguete de estimulación + 3 pañales etapa 1" },
  { name: "Esterilizador teteros + 3 pañales etapa 1" },
  { name: "Juguetes de contraste (blanco y negro) + 3 pañales etapa 1" },
  { name: "Cuna colecho + 3 pañales etapa 1" },
  { name: "Crema para el rabito, crema para el cuerpo + 3 pañales etapa 3" },
  { name: "Juego de sabanas para colecho + 3 pañales etapa 3" },
  { name: "Aspirador nasal tipo tubo (sacamocos) + 3 pañales etapa 3" },
  { name: "Baberos y toallitas de tela o microfibra + 3 pañales etapa 3" },
  { name: "Kit johnsons baño recién nacido + 3 pañales etapa 3" },
  { name: "Vajilla para bebé + 3 pañales etapa 3" },
  { name: "Termómetro + pañitos húmedos" },
  { name: "Cortaúñas eléctrico para bebé + 3 pañales etapa 3" },
  { name: "Cambiador + 3 pañales etapa 3" },
  { name: "Pañitos húmedos + chupetes + 3 pañales etapa 2" },
  { name: "Fular o Canguro + 3 pañales etapa 3" }
];

let isSpinning = false;

function saveGiftAssignment(name, gift) {
  db.collection("assignedGifts").add({
    name: name,
    gift: gift,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("Regalo asignado guardado correctamente.");
  })
  .catch((error) => {
    console.error("Error al guardar el regalo: ", error);
  });
}

function loadAssignedGifts() {
  db.collection("assignedGifts").orderBy("timestamp").onSnapshot((querySnapshot) => {
    const assignedGifts = [];
    querySnapshot.forEach((doc) => {
      assignedGifts.push(doc.data());
    });
    updateAssignedGiftsList(assignedGifts);
  });
}

function drawWheel() {
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const numSegments = gifts.length;
  const segmentAngle = (2 * Math.PI) / numSegments;

  for (let i = 0; i < numSegments; i++) {
    const angle = segmentAngle * i;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, angle, angle + segmentAngle);
    ctx.fillStyle = i % 2 === 0 ? "#f7b731" : "#eb3b5a";
    ctx.fill();
    ctx.stroke();

    // Dibujar el texto del regalo
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angle + segmentAngle / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Arial";
    ctx.fillText(gifts[i].name, 0, -150);  // Solo el nombre del regalo
    ctx.restore();
  }
}

function spinWheel() {
  const name = document.getElementById('name').value;
  if (!name) {
    alert("Por favor ingresa tu nombre.");
    return;
  }

  const remainingGifts = gifts.filter(gift => !gift.ticked);
  if (remainingGifts.length === 0) {
    alert("Todos los regalos ya han sido asignados.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * remainingGifts.length);
  const gift = remainingGifts[randomIndex];
  remainingGifts[randomIndex].ticked = true;

  // Almacenar en la base de datos
  saveGiftAssignment(name, gift.name);

  // Mostrar el nombre del usuario y el regalo asignado
  document.getElementById('result').innerText = `${name}, te ha tocado: ${gift.name}`;
}

function updateAssignedGiftsList(assignedGifts) {
  const assignedList = document.getElementById('assignedGifts');
  assignedList.innerHTML = '';

  assignedGifts.forEach((assignment) => {
    const li = document.createElement('li');
    li.textContent = `${assignment.name} recibió ${assignment.gift}`;
    assignedList.appendChild(li);
  });
}

window.onload = () => {
  drawWheel();
  loadAssignedGifts();
};

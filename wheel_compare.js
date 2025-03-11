const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
let names = [];
let spinning = false;
let currentRotation = 0;

// Add name to the list
function addName() {
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();
    if (name) {
        names.push(name);
        updateNameList();
        drawWheel();
        nameInput.value = "";
    }
}

// Update the displayed name list
function updateNameList() {
    const list = document.getElementById("name-list");
    list.innerHTML = "";
    names.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        list.appendChild(li);
    });
}

// Draw the spinner wheel with a fixed top marker
function drawWheel() {
    if (names.length === 0) return;

    const numSlices = names.length;
    const anglePerSlice = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wedges
    for (let i = 0; i < numSlices; i++) {
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, i * anglePerSlice, (i + 1) * anglePerSlice);
        ctx.fillStyle = `hsl(${i * (360 / numSlices)}, 100%, 50%)`;
        ctx.fill();
        ctx.stroke();

        // Text labels
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(i * anglePerSlice + anglePerSlice / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(names[i], 180, 5);
        ctx.restore();
    }

    // Draw fixed marker line outside the circle
    ctx.beginPath();
    ctx.moveTo(200, 10); // Start at the top center of the circle
    ctx.lineTo(200, -20); // Extend the line above the circle
    ctx.lineWidth = 4;
    ctx.strokeStyle = "red";
    ctx.stroke();
}

// Spin the wheel
function spinWheel() {
    if (spinning || names.length === 0) return;

    spinning = true;
    let randomSpin = Math.floor(2000 + Math.random() * 3000);
    
    gsap.to({}, {
        duration: 3,
        onUpdate: function() {
            let progress = this.progress();
            let rotation = currentRotation + progress * randomSpin;
            canvas.style.transform = `rotate(${rotation}deg)`;
        },
        ease: "power4.out",
        onComplete: function() {
            spinning = false;
            currentRotation += randomSpin;
            determineWinner();
        }
    });
}

// Determine the winner based on which wedge is at the top
function determineWinner() {
    const numSlices = names.length;
    if (numSlices === 0) return;

    const finalAngle = currentRotation % 360; // Normalize angle between 0-360
    const anglePerSlice = 360 / numSlices;
    const index = Math.floor((finalAngle + anglePerSlice / 2) % 360 / anglePerSlice) % numSlices;

    alert(`Eliminated: ${names[index]}`);

    // Remove selected name
    names.splice(index, 1);
    updateNameList();
    drawWheel();

    if (names.length === 1) {
        alert(`Winner: ${names[0]}! 🎉`);
    }
}

// Initial Draw
drawWheel();

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
let names = [];
let spinning = false;

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

// Draw the spinner wheel
function drawWheel() {
    if (names.length === 0) return;

    const numSlices = names.length;
    const anglePerSlice = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
}

// Spin the wheel
function spinWheel() {
    if (spinning || names.length === 0) return;

    spinning = true;
    let randomSpin = Math.floor(2000 + Math.random() * 3000);
    gsap.to(canvas, {
        rotation: `+=${randomSpin}`,
        duration: 3,
        ease: "power4.out",
        onComplete: () => {
            spinning = false;
            removeWinner();
        }
    });
}

// Remove the winner from the list
function removeWinner() {
    const finalAngle = (canvas.style.transform.match(/rotate\(([^)]+)deg\)/) || [])[1] || 0;
    const index = Math.floor(((360 - (finalAngle % 360)) / 360) * names.length) % names.length;
    
    if (names.length > 1) {
        names.splice(index, 1);
        updateNameList();
        drawWheel();
    } else {
        alert(`Winner: ${names[0]}!`);
    }
}

// Initial Draw
drawWheel();

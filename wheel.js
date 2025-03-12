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

// Draw the spinner wheel
function drawWheel() {
    if (names.length === 0) return;

    const numSlices = names.length;
    const anglePerSlice = (2 * Math.PI) / numSlices;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wedges
    for (let i = 0; i < numSlices; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, i * anglePerSlice, (i + 1) * anglePerSlice);
        ctx.fillStyle = `hsl(${i * (360 / numSlices)}, 100%, 50%)`;
        ctx.fill();
        ctx.stroke();

        // Text labels
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(i * anglePerSlice + anglePerSlice / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = `${Math.max(12, Math.min(20, radius / names.length))}px Arial`;
        ctx.fillText(names[i], radius - 20, 5);
        ctx.restore();
    }
}

// Spin the wheel
function spinWheel() {
    if (spinning || names.length === 0) return;

    spinning = true;
    let randomSpin = Math.floor(2000 + Math.random() * 3000);
    
    gsap.to({}, {
        duration: 2,
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

function determineWinner() {
    if (names.length === 0) return;

    const numSlices = names.length;
    const anglePerSlice = 360 / numSlices;

    // Normalize finalAngle within [0, 360)
    let finalAngle = (currentRotation % 360);

    // Adjust finalAngle to account for the 90-degree starting position
    let alignment = (finalAngle + 90) % 360;

    // Calculate the index by dividing alignment by the angle per slice
    const index = Math.floor((360 - alignment) / anglePerSlice);

    // Show the result
    alert(`Eliminated: ${names[index]} at index ${index}, final angle: ${finalAngle}. Names list: ${names}. Current Rotation: ${currentRotation}. Angle per slice: ${anglePerSlice}. Alignment: ${alignment}`);

    // Remove the eliminated name
    names.splice(index, 1);
    updateNameList();

    // If only one name is left, declare the winner
    if (names.length === 1) {
        alert(`Winner: ${names[0]}! 🎉`);
        drawWheel();
    } else {
        // Reset rotation for the next spin to start from 0 degrees
        currentRotation = 0;
        // Reset the actual visual rotation of the canvas
        canvas.style.transform = `rotate(0deg)`;
        drawWheel();
    }
}

drawWheel();

// alert(`Eliminated: ${names[index]} at index ${index} and final angle ${finalAngle}`);

// The following code puts a little text box below the spin button
// I prefer the pop up, but change this and showNotification refs to switch.
// Show non-blocking notifications
// function showNotification(message) {
//     const notification = document.createElement("div");
//     notification.className = "notification";
//     notification.textContent = message;
//     document.body.appendChild(notification);
    
//     setTimeout(() => {
//         notification.classList.add("show");
//         setTimeout(() => {
//             notification.classList.remove("show");
//             setTimeout(() => notification.remove(), 500);
//         }, 2000);
//     }, 10);
// }

// Initial Draw


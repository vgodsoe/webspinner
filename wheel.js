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

// Determine the winner based on which wedge is at the top
function determineWinner() {
    const numSlices = names.length;
    if (numSlices === 0) return;

    const finalAngle = (currentRotation % 360); // Normalize angle between 0-360
    const anglePerSlice = 360 / numSlices;

    // Calculate the index, adding half the slice size for better alignment
    const index = Math.round((finalAngle + 90 + anglePerSlice / 2) / anglePerSlice) % names.length;

    // Show the notification or alert
    // alert(`Eliminated: ${names[index]} at index ${index}, current rotation: ${currentRotation}, final angle: ${finalAngle}, names: ${names}`);
    alert(`Eliminated: ${names[index]}!`);

    // Remove the selected name
    names.splice(index, 1);
    updateNameList();
    drawWheel();

    if (names.length === 1) {
        // Declare the winner when only one name is left
        alert(`Winner: ${names[0]}! 🎉`);
    } else {
        // Adjust the current rotation to continue spinning
        // For example, to continue spinning to the next name, add 360 degrees to the rotation:
        currentRotation += 360;
    }
}



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
drawWheel();

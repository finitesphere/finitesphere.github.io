// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(300, 300); // Set size to match CSS
document.querySelector('.canvas-container').appendChild(renderer.domElement);

// Create wireframe sphere with fewer segments
const geometry = new THREE.SphereGeometry(5, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 10;

// Variables for interaction
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let velocity = { x: 0, y: 0 };
const dampingFactor = 0.95;

// Mouse event listeners
renderer.domElement.addEventListener('mousedown', function(event) {
    isDragging = true;
});

renderer.domElement.addEventListener('mousemove', function(event) {
    if (isDragging) {
        const deltaMove = {
            x: event.offsetX - previousMousePosition.x,
            y: event.offsetY - previousMousePosition.y
        };

        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 0.5),
                toRadians(deltaMove.x * 0.5),
                0,
                'XYZ'
            ));

        sphere.quaternion.multiplyQuaternions(deltaRotationQuaternion, sphere.quaternion);

        velocity = {
            x: deltaMove.x * 0.1,
            y: deltaMove.y * 0.1
        };
    }

    previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY
    };
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

// Convert degrees to radians
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(velocity.y),
                toRadians(velocity.x),
                0,
                'XYZ'
            ));

        sphere.quaternion.multiplyQuaternions(deltaRotationQuaternion, sphere.quaternion);

        // Apply damping to slow down the rotation over time
        velocity.x *= dampingFactor;
        velocity.y *= dampingFactor;
    }

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', function() {
    camera.aspect = 1; // Aspect ratio is 1:1 since the canvas is square
    camera.updateProjectionMatrix();
    renderer.setSize(300, 300); // Match size to CSS
});

// Keyboard navigation for nav links
const navLinks = document.querySelectorAll('.nav-link');
let currentIndex = 0;

navLinks[currentIndex].focus();

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % navLinks.length;
        navLinks[currentIndex].focus();
    } else if (event.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
        navLinks[currentIndex].focus();
    } else if (event.key === 'Enter') {
        navLinks[currentIndex].click();
    }
});

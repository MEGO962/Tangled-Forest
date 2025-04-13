import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
document.getElementById('container').appendChild(renderer.domElement);

// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// Reduce complexity for mobile
if (isMobile) {
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = false;
}

// Sky and fog
scene.background = new THREE.Color(0xD8BFD8);
scene.fog = new THREE.FogExp2(0xcccccc, 0.01);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffe4c4, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Ground with improved texture
const groundGeometry = new THREE.PlaneGeometry(100, 2000);
const groundMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x228B22,
    map: createNoiseTexture()
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
scene.add(ground);

// Texture functions (unchanged)
function createNoiseTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            if (Math.random() > 0.85) {
                const value = Math.random() * 40 + 160;
                ctx.fillStyle = `rgb(${value * 0.2 + 30}, ${value * 0.6 + 80}, ${value * 0.1})`;
                ctx.fillRect(x, y, 2, 2);
            }
        }
    }
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(20, 80, 20, ${Math.random() * 0.2 + 0.1})`;
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 40 + 10, 0, Math.PI * 2);
        ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
}

function createStoneTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#9E9E81';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 200; i++) {
        const width = Math.random() * 20 + 10;
        const height = Math.random() * 20 + 10;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const value = Math.random() * 20 + 140;
        ctx.fillStyle = `rgb(${value}, ${value - 10}, ${value - 20})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(80, 80, 70, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    return new THREE.CanvasTexture(canvas);
}

function createShingleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#6A4987';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const tileHeight = 16;
    const tileWidth = 32;
    for (let y = 0; y < canvas.height; y += tileHeight) {
        const rowOffset = (y % (tileHeight * 2) === 0) ? 0 : tileWidth / 2;
        for (let x = -rowOffset; x < canvas.width; x += tileWidth) {
            const value = Math.random() * 30 + 80;
            ctx.fillStyle = `rgb(${value + 30}, ${value - 30}, ${value + 60})`;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + tileWidth, y);
            ctx.lineTo(x + tileWidth - 2, y + tileHeight - 2);
            ctx.lineTo(x + 2, y + tileHeight - 2);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = `rgba(180, 150, 200, 0.5)`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    return new THREE.CanvasTexture(canvas);
}

// Tree functions (unchanged)
function addConicalTree(x, z) {
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 6, 12);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 3, z);
    scene.add(trunk);
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x006400, side: THREE.DoubleSide });
    for (let i = 0; i < 3; i++) {
        const leafGeometry = new THREE.ConeGeometry(2 - i * 0.5, 3, 8);
        const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
        leaves.position.set(x, 6 + i * 1.5, z);
        scene.add(leaves);
    }
}

function addBushyTree(x, z) {
    const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.6, 5, 10);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x5C4033 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 2.5, z);
    scene.add(trunk);
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const leafGeometry = new THREE.SphereGeometry(2.5, 12, 12);
    const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
    leaves.position.set(x, 5.5, z);
    scene.add(leaves);
}

function addTallTree(x, z) {
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 10, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 5, z);
    scene.add(trunk);
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x006633 });
    const leafGeometry = new THREE.CylinderGeometry(1, 1.5, 4, 8);
    const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
    leaves.position.set(x, 9, z);
    scene.add(leaves);
}

// Lanterns (unchanged)
const lanterns = [];
function addLantern(x, y, z) {
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(x, y, z);
    const lanternGeometry = new THREE.CylinderGeometry(0.3, 0.5, 0.8, 8);
    const lanternMaterial = new THREE.MeshPhongMaterial({
        color: 0xF7E9D3,
        emissive: 0xF7CF8B,
        emissiveIntensity: 0.4,
        shininess: 50
    });
    const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial);
    lanternGroup.add(lantern);
    const topGeometry = new THREE.ConeGeometry(0.3, 0.4, 8);
    const topMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 0.6;
    lanternGroup.add(top);
    const light = new THREE.PointLight(0xFFD54F, 1.5, 15);
    light.position.y = 0.2;
    lanternGroup.add(light);
    scene.add(lanternGroup);
    lanterns.push({ mesh: lanternGroup, light, baseY: y });
}

// Tower (unchanged)
function addTower() {
    const towerGroup = new THREE.Group();
    towerGroup.position.set(0, 0, -400);
    const baseGeometry = new THREE.CylinderGeometry(9, 12, 6, 16);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x9E9E81, map: createStoneTexture() });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 3;
    towerGroup.add(base);
    const bodyGeometry = new THREE.CylinderGeometry(6, 8, 50, 16);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x9E9E81, map: createStoneTexture() });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 31;
    towerGroup.add(body);
    addStoneDetails(body);
    addTowerWindows(towerGroup);
    addVinesAndFlowers(towerGroup);
    const balconyFloorGeometry = new THREE.CylinderGeometry(8, 8, 1, 16);
    const balconyFloorMaterial = new THREE.MeshLambertMaterial({ color: 0x8B5A2B });
    const balconyFloor = new THREE.Mesh(balconyFloorGeometry, balconyFloorMaterial);
    balconyFloor.position.y = 56;
    towerGroup.add(balconyFloor);
    addBalconyRailings(towerGroup);
    const topRoomGeometry = new THREE.CylinderGeometry(7, 7, 15, 16);
    const topRoomMaterial = new THREE.MeshLambertMaterial({ color: 0x9E9E81, map: createStoneTexture() });
    const topRoom = new THREE.Mesh(topRoomGeometry, topRoomMaterial);
    topRoom.position.y = 64;
    towerGroup.add(topRoom);
    const windowFrameGeometry = new THREE.BoxGeometry(4, 6, 0.3);
    const windowFrameMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
    windowFrame.position.set(0, 64, 7);
    towerGroup.add(windowFrame);
    const shutterGeometry = new THREE.BoxGeometry(2.2, 5.8, 0.2);
    const shutterMaterial = new THREE.MeshLambertMaterial({ color: 0x6B8E23 });
    const leftShutter = new THREE.Mesh(shutterGeometry, shutterMaterial);
    leftShutter.position.set(-2, 64, 7.2);
    towerGroup.add(leftShutter);
    const rightShutter = new THREE.Mesh(shutterGeometry, shutterMaterial);
    rightShutter.position.set(2, 64, 7.2);
    towerGroup.add(rightShutter);
    const roofGeometry = new THREE.ConeGeometry(9, 18, 16);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x6A4987, map: createShingleTexture() });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 80;
    towerGroup.add(roof);
    const spireGeometry = new THREE.CylinderGeometry(0.2, 0.6, 5, 8);
    const spireMaterial = new THREE.MeshLambertMaterial({ color: 0x6A4987 });
    const spire = new THREE.Mesh(spireGeometry, spireMaterial);
    spire.position.y = 91;
    towerGroup.add(spire);
    addSunEmblem(towerGroup, 93.5);
    scene.add(towerGroup);
}

function addStoneDetails(tower) {
    const stoneGeometry = new THREE.BoxGeometry(1, 0.8, 0.3);
    const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0xAAAAAA });
    for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const height = Math.random() * 45 - 10;
        const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
        stone.position.set(Math.cos(angle) * 6.1, height + 31, Math.sin(angle) * 6.1);
        stone.rotation.y = angle + Math.PI;
        stone.scale.set(Math.random() * 0.5 + 0.7, Math.random() * 0.5 + 0.7, Math.random() * 0.5 + 0.7);
        tower.add(stone);
    }
}

function addTowerWindows(towerGroup) {
    const windowGeometry = new THREE.BoxGeometry(1.5, 2, 0.3);
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x4C2F13 });
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI / 4) + (Math.PI / 8);
        const height = i * 5 + 15;
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(Math.cos(angle) * 6.1, height, Math.sin(angle) * 6.1);
        windowMesh.rotation.y = angle + Math.PI;
        towerGroup.add(windowMesh);
    }
}

function addVinesAndFlowers(towerGroup) {
    const vineMaterial = new THREE.MeshLambertMaterial({ color: 0x006400 });
    const flowerMaterial = new THREE.MeshLambertMaterial({ color: 0xFF69B4 });
    for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const height = Math.random() * 45 + 10;
        const vineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5),
            new THREE.Vector3(Math.random() - 0.5, Math.random() * 4, Math.random() - 0.5),
            new THREE.Vector3(Math.random() - 0.5, Math.random() * 6, Math.random() - 0.5)
        ]);
        const vineGeometry = new THREE.TubeGeometry(vineCurve, 8, 0.1, 8, false);
        const vine = new THREE.Mesh(vineGeometry, vineMaterial);
        vine.position.set(Math.cos(angle) * 6.2, height, Math.sin(angle) * 6.2);
        towerGroup.add(vine);
        if (Math.random() > 0.6) {
            const flowerCount = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < flowerCount; j++) {
                const flowerGeometry = new THREE.SphereGeometry(0.15, 8, 8);
                const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
                const offset = Math.random();
                const pos = vineCurve.getPointAt(offset);
                flower.position.set(vine.position.x + pos.x, vine.position.y + pos.y, vine.position.z + pos.z);
                towerGroup.add(flower);
            }
        }
    }
}

function addBalconyRailings(towerGroup) {
    const railingMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const railingGeometry = new THREE.TorusGeometry(7.5, 0.2, 8, 32);
    const railing = new THREE.Mesh(railingGeometry, railingMaterial);
    railing.rotation.x = Math.PI / 2;
    railing.position.y = 57.5;
    towerGroup.add(railing);
    const postGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 8);
    for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI * 2) / 16;
        const post = new THREE.Mesh(postGeometry, railingMaterial);
        post.position.set(Math.cos(angle) * 7.5, 56.5, Math.sin(angle) * 7.5);
        towerGroup.add(post);
    }
    const middleRailingGeometry = new THREE.TorusGeometry(7.5, 0.15, 8, 32);
    const middleRailing = new THREE.Mesh(middleRailingGeometry, railingMaterial);
    middleRailing.rotation.x = Math.PI / 2;
    middleRailing.position.y = 56.5;
    towerGroup.add(middleRailing);
}

function addSunEmblem(towerGroup, height) {
    const emblemGroup = new THREE.Group();
    emblemGroup.position.y = height;
    const centerGeometry = new THREE.SphereGeometry(0.7, 12, 12);
    const centerMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    emblemGroup.add(center);
    const rayLongGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const rayMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const ray = new THREE.Mesh(rayLongGeometry, rayMaterial);
        ray.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
        ray.rotation.z = Math.PI / 2;
        ray.rotation.y = angle;
        emblemGroup.add(ray);
    }
    const rayShortGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
        const ray = new THREE.Mesh(rayShortGeometry, rayMaterial);
        ray.position.set(Math.cos(angle) * 1.3, 0, Math.sin(angle) * 1.3);
        ray.rotation.z = Math.PI / 2;
        ray.rotation.y = angle;
        emblemGroup.add(ray);
    }
    towerGroup.add(emblemGroup);
}

// Cave entrance - Moved before tower
// Modified cave entrance to match waterfall size (20 units wide)
function addCaveEntrance() {
    const caveGroup = new THREE.Group();
    caveGroup.position.set(0, 0, -250);
    const caveGeometry = new THREE.CylinderGeometry(20, 20, 30, 32, 1, true); // Diameter 40
    const caveMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x808080,
        map: createStoneTexture(),
        side: THREE.DoubleSide
    });
    const caveTunnel = new THREE.Mesh(caveGeometry, caveMaterial);
    caveTunnel.rotation.x = Math.PI / 2;
    caveTunnel.position.y = 10;
    caveGroup.add(caveTunnel);
    const vineMaterial = new THREE.MeshLambertMaterial({ color: 0x006400 });
    for (let i = 0; i < 20; i++) {
        const vineGeometry = new THREE.CylinderGeometry(0.1, 0.1, Math.random() * 5 + 5, 8);
        const vine = new THREE.Mesh(vineGeometry, vineMaterial);
        vine.position.set(Math.random() * 32 - 16, 20 - Math.random() * 2, -15 + Math.random() * 5);
        caveGroup.add(vine);
    }
    scene.add(caveGroup);
}

// Modified waterfall - width close to cave's diameter (40 units)
let waterfall;
function addSmallWaterfall() {
    const waterfallGroup = new THREE.Group();
    waterfallGroup.position.set(0, 0, -265); // Position as requested
    const waterGeometry = new THREE.PlaneGeometry(40, 30, 20, 15); // Width 40 to match cave's diameter
    const waterMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x87CEEB, 
        transparent: true, 
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    const waterPositions = waterGeometry.attributes.position;
    const waterVertices = [];
    for (let i = 0; i < waterPositions.count; i++) {
        const x = waterPositions.getX(i);
        const y = waterPositions.getY(i);
        const z = waterPositions.getZ(i);
        waterVertices.push({ x, y: y + 15, z: z + (Math.random() * 0.1) });
    }
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = 15;
    waterfallGroup.add(water);
    const poolGeometry = new THREE.CircleGeometry(20, 32); // Radius 20 (half of width 40)
    const poolMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x87CEEB, 
        transparent: true, 
        opacity: 0.7
    });
    const pool = new THREE.Mesh(poolGeometry, poolMaterial);
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.1;
    waterfallGroup.add(pool);
    scene.add(waterfallGroup);
    function animateWaterfall() {
        for (let i = 0; i < waterPositions.count; i++) {
            waterVertices[i].y -= 0.05;
            if (waterVertices[i].y < -20) waterVertices[i].y = 20; // Adjusted for height 30
            const sway = Math.sin(waterVertices[i].y * 0.3 + Date.now() * 0.002) * 0.1;
            waterPositions.setX(i, waterVertices[i].x + sway);
            waterPositions.setY(i, waterVertices[i].y);
            waterPositions.setZ(i, waterVertices[i].z);
        }
        waterPositions.needsUpdate = true;
    }
    return { animate: animateWaterfall };
}

// Modified path - goes through cave and waterfall, goes directly around tower
// Modified path - smooth transition at balcony level to front
let pathCurve;
function addLanternPath() {
    const pathPoints = [
        { x: 0, z: -20, y: 0.1 },    // Start
        { x: -10, z: -60, y: 0.1 },
        { x: -5, z: -120, y: 0.1 },
        { x: 10, z: -170, y: 0.1 },
        { x: 5, z: -230, y: 0.1 },
        { x: 0, z: -250, y: 0.1 },  // Through cave entrance
        { x: 0, z: -270, y: 0.1 },  // Through waterfall
    ];
    
    // Approach tower
    pathPoints.push({ x: 0, z: -360, y: 0.1 }); // Straight approach
    
    // Circle around tower starting from the left side
    const towerCenter = { x: 0, z: -400 };
    const radius = 30;
    const circleSegments = 16;
    
    // Start from the left (angle = π or 180 degrees)
    for (let i = 0; i <= circleSegments; i++) {
        const angle = Math.PI + (i / circleSegments) * Math.PI * 2; // Start at left, go counterclockwise
        const x = towerCenter.x + Math.cos(angle) * radius;
        const z = towerCenter.z + Math.sin(angle) * radius;
        pathPoints.push({ x, z, y: 0.1 });
    }
    
    // Spiral up to balcony with one loop
    const heightStart = 0.1;
    const heightEnd = 56;
    const loops = 1;
    const spiralSegments = 30;
    
    for (let i = 0; i <= spiralSegments; i++) {
        const t = i / spiralSegments;
        const angle = Math.PI + t * Math.PI * 2 * loops; // One loop from left
        const height = THREE.MathUtils.lerp(heightStart, heightEnd, t);
        const x = towerCenter.x + Math.cos(angle) * radius;
        const z = towerCenter.z + Math.sin(angle) * radius;
        pathPoints.push({ x, z, y: height });
    }
    
    const balconyPosition = { x: 0, z: -370, y: 56 };
    const balconySegments = 32; // Full circle around the tower
    let foundBalcony = false;

    // Start from wherever the previous path left off
    for (let i = 1; i <= balconySegments; i++) {
        const angle = Math.PI + (i / balconySegments) * Math.PI * 2; // Circle around the tower
        const x = towerCenter.x + Math.cos(angle) * radius;
        const z = towerCenter.z + Math.sin(angle) * radius;
        const y = 56; // Balcony height
        
        // Check if we're close to the balcony position
        if (Math.abs(x - balconyPosition.x) < 2 && 
            Math.abs(z - balconyPosition.z) < 2) {
            // Add the exact balcony position as the final point
            pathPoints.push(balconyPosition);
            foundBalcony = true;
            break;
        }
        
        pathPoints.push({ x, z, y }); // Stay at balcony height
    }

    // If we went through the whole loop and didn't find the balcony,
    // add the balcony position explicitly
    if (!foundBalcony) {
        pathPoints.push(balconyPosition);
    }
    
    pathCurve = new THREE.CatmullRomCurve3(pathPoints.map(p => new THREE.Vector3(p.x, p.y, p.z)));
    const pathGeometry = new THREE.TubeGeometry(pathCurve, 64, 2, 8, false);
    const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
    pathMesh.position.y = -0.4;
    scene.add(pathMesh);
    
    // Add lanterns along the path
    for (let i = 0; i < pathPoints.length; i += 3) {
        const point = pathPoints[i];
        const nextPoint = pathPoints[Math.min(i + 1, pathPoints.length - 1)];
        const dx = nextPoint.x - point.x;
        const dz = nextPoint.z - point.z;
        const length = Math.sqrt(dx * dx + dz * dz);
        const perpX = -dz / length * 5;
        const perpZ = dx / length * 5;
        addLantern(point.x + perpX, point.y + 1.5, point.z + perpZ);
        addLantern(point.x - perpX, point.y + 1.5, point.z - perpZ);
    }
    
    return pathPoints;
}


// Floating lanterns
const floatingLanterns = [];
function addFloatingLanterns(pathPoints) {
    // Scene-wide lanterns - reduce count for mobile
    const sceneLanternCount = isMobile ? 10 : 20;
    const towerLanternCount = isMobile ? 5 : 10;
    
    for (let i = 0; i < sceneLanternCount; i++) {
        const lanternGroup = new THREE.Group();
        const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFEBCD,
            emissive: 0xF7CF8B,
            emissiveIntensity: 0.5, // Base value, will increase in night mode
            transparent: true,
            opacity: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        lanternGroup.add(body);
        const light = new THREE.PointLight(0xFFD54F, 0.8, 10);
        lanternGroup.add(light);

        const x = Math.random() * 160 - 80;
        const z = Math.random() * 400 - 430;
        const y = Math.random() * 10 + 5;
        const distanceToTower = Math.sqrt(x * x + (z + 400) * (z + 400));
        if (distanceToTower < 25) continue;

        lanternGroup.position.set(x, y, z);

        const lanternData = {
            mesh: lanternGroup,
            light: light,
            material: bodyMaterial, // Store material for glow adjustment
            speed: Math.random() * 0.02 + 0.01,
            wobble: Math.random() * 0.01 + 0.005,
            phase: Math.random() * Math.PI * 2,
            baseY: y
        };
        floatingLanterns.push(lanternData);
        scene.add(lanternGroup);
    }

    // Tower lanterns
    for (let i = 0; i < towerLanternCount; i++) {
        const lanternGroup = new THREE.Group();
        const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFEBCD,
            emissive: 0xF7CF8B,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        lanternGroup.add(body);
        const light = new THREE.PointLight(0xFFD54F, 0.8, 10);
        lanternGroup.add(light);

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 30 + 10;
        const x = Math.cos(angle) * radius;
        const z = -400 + Math.sin(angle) * radius;
        const y = Math.random() * 15 + 10;

        lanternGroup.position.set(x, y, z);

        const lanternData = {
            mesh: lanternGroup,
            light: light,
            material: bodyMaterial, // Store material
            speed: Math.random() * 0.02 + 0.01,
            wobble: Math.random() * 0.01 + 0.005,
            phase: Math.random() * Math.PI * 2,
            baseY: y
        };
        floatingLanterns.push(lanternData);
        scene.add(lanternGroup);
    }
}

// Add trees and grass (unchanged)
function addTrees(pathPoints) {
    if (!pathCurve) return;
    
    // Reduce tree count on mobile
    const treeCount = isMobile ? 100 : 200;
    
    for (let i = 0; i < treeCount; i++) {
        const x = Math.random() * 160 - 80;
        const z = Math.random() * 400 - 430;
        const distanceToTower = Math.sqrt(x * x + (z + 400) * (z + 400));
        
        // Minimum distance from tower center, slightly reduced
        if (distanceToTower < 25) continue; // Reduced from 40 to 25
        
        // Check against the path curve with a smaller buffer
        let tooCloseToPath = false;
        const steps = isMobile ? 25 : 50; // Further reduce steps on mobile
        for (let t = 0; t <= 1; t += 1 / steps) {
            const point = pathCurve.getPointAt(t);
            const distanceToPath = Math.sqrt(
                (x - point.x) * (x - point.x) + 
                (z - point.z) * (z - point.z)
            );
            // Reduced buffer from 15 to 6 to allow trees closer
            if (distanceToPath < 10) {
                // For spiral section near tower, check height with tighter tolerance
                if (distanceToTower < 35) { // Reduced from 50
                    const heightDifference = Math.abs(point.y);
                    if (point.y < 3 || (heightDifference < point.y + 5)) { // Tighter height check
                        tooCloseToPath = true;
                        break;
                    }
                } else if (distanceToPath < 4) { // Even stricter for flat sections
                    tooCloseToPath = true;
                    break;
                }
            }
        }
        
        if (tooCloseToPath) continue;
        
        // Add tree if position is clear
        const treeType = Math.floor(Math.random() * 3);
        switch (treeType) {
            case 0: addConicalTree(x, z); break;
            case 1: addBushyTree(x, z); break;
            case 2: addTallTree(x, z); break;
        }
        const scale = Math.random() * 0.5 + 0.75; // Scale remains the same
        scene.children[scene.children.length - 1].scale.set(scale, scale, scale);
        scene.children[scene.children.length - 1].rotation.y = Math.random() * Math.PI * 2;
    }
}

function addGrass(pathPoints) {
    const grassGeometry = new THREE.PlaneGeometry(0.1, 1);
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x32CD32, side: THREE.DoubleSide });
    
    // Reduce grass count on mobile
    const grassCount = isMobile ? 2000 : 5000;
    
    const grass = new THREE.InstancedMesh(grassGeometry, grassMaterial, grassCount);
    let instanceIndex = 0;
    for (let i = 0; i < grassCount; i++) {
        const x = Math.random() * 160 - 80;
        const z = Math.random() * 400 - 430;
        const distanceToTower = Math.sqrt(x * x + (z + 400) * (z + 400));
        if (distanceToTower < 15) continue;
        let tooCloseToPath = false;
        for (let j = 0; j < pathPoints.length; j++) {
            const point = pathPoints[j];
            const distanceToPath = Math.sqrt((x - point.x) * (x - point.x) + (z - point.z) * (z - point.z));
            if (distanceToPath < 6) {
                tooCloseToPath = true;
                break;
            }
        }
        if (tooCloseToPath) continue;
        const matrix = new THREE.Matrix4();
        matrix.setPosition(x, 0.5, z);
        matrix.scale(new THREE.Vector3(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1));
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(Math.random() * Math.PI * 2);
        matrix.multiply(rotationMatrix);
        grass.setMatrixAt(instanceIndex, matrix);
        instanceIndex++;
    }
    grass.count = instanceIndex;
    scene.add(grass);
}

// Add scene elements
addCaveEntrance();
waterfall = addSmallWaterfall();
addTower();
const pathPoints = addLanternPath();
addTrees(pathPoints);
addGrass(pathPoints);
addFloatingLanterns(pathPoints);

// Camera initial position
camera.position.set(0, 5.1, -20);

// Scroll navigation
let targetT = 0;
let t = 0;
let isScrolling = false;
let scrollTimeout;
let currentLookAt = new THREE.Vector3(0, 0, -400);
const balconyTarget = new THREE.Vector3(0, 56, -400);
let shouldLookAtBalcony = false;

// Night mode toggle
let isNight = false;
const nightModeButton = document.getElementById('night-mode');
nightModeButton.addEventListener('click', () => {
    isNight = !isNight;
    scene.background = new THREE.Color(isNight ? 0x191970 : 0xD8BFD8);
    directionalLight.intensity = isNight ? 0.2 : 0.8;
    ambientLight.intensity = isNight ? 0.2 : 0.8;
});

// Music toggle
const music = document.getElementById('background-music');
music.volume = 1.0; // Set volume to 100% (maximum)
const musicToggle = document.getElementById('music-toggle');
musicToggle.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicToggle.textContent = "Pause Music";
    } else {
        music.pause();
        musicToggle.textContent = "Play Music";
    }
});

// Volume control
const volumeUpBtn = document.getElementById('volume-up');
volumeUpBtn.addEventListener('click', () => {
    // Increase volume by 20% each click, up to a maximum of 500%
    // This uses the AudioContext API to boost volume beyond the standard 100% limit
    if (!window.audioCtx) {
        // Create audio context and connect to the audio element
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(music);
        const gainNode = audioCtx.createGain();
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Store the gain node for future volume adjustments
        window.audioCtx = audioCtx;
        window.gainNode = gainNode;
        window.currentGain = 1.0;
    }
    
    // Increase the gain (volume)
    window.currentGain += 0.5;
    if (window.currentGain > 5) window.currentGain = 5; // Cap at 500%
    window.gainNode.gain.value = window.currentGain;
    
    // Update button text
    volumeUpBtn.textContent = `Volume: ${Math.round(window.currentGain * 100)}%`;
});

// Animation loop with performance optimizations
function animate() {
    requestAnimationFrame(animate);
    
    // On mobile, update less frequently to improve performance
    if (isMobile && Math.random() > 0.25) {
        renderer.render(scene, camera);
        return; // Skip some updates on mobile
    }
    
    if (waterfall && typeof waterfall.animate === 'function') {
        waterfall.animate();
    }
    
    lanterns.forEach(lantern => {
        lantern.light.intensity = 1.2 + Math.sin(Date.now() * 0.005) * 0.3;
        lantern.mesh.position.y = lantern.baseY + Math.sin(Date.now() * 0.002) * 0.1;
    });
    
    floatingLanterns.forEach(lantern => {
        lantern.mesh.position.y += lantern.speed;
        if (lantern.mesh.position.y > lantern.baseY + 10) {
            lantern.mesh.position.y = lantern.baseY;
        }
        lantern.mesh.position.x += Math.sin(Date.now() * 0.001 + lantern.phase) * lantern.wobble;
        lantern.mesh.position.z += Math.cos(Date.now() * 0.0015 + lantern.phase) * lantern.wobble;
        lantern.mesh.rotation.y += 0.003;
    
        if (isNight) {
            // Night mode: Stronger glow
            lantern.light.intensity = 2.0 + Math.sin(Date.now() * 0.002 + lantern.phase) * 0.8; // Brighter, more flicker
            lantern.light.distance = 20; // Wider reach
            lantern.material.emissiveIntensity = 1.5 + Math.sin(Date.now() * 0.002 + lantern.phase) * 0.5; // Glowing material
        } else {
            // Day mode: Subtle glow
            lantern.light.intensity = 0.8 + Math.sin(Date.now() * 0.002 + lantern.phase) * 0.4;
            lantern.light.distance = 10;
            lantern.material.emissiveIntensity = 0.5; // Default emissive
        }
    });
    
    if (pathCurve) {
        t = THREE.MathUtils.lerp(t, targetT, 0.05);
        const position = pathCurve.getPointAt(t);
        camera.position.set(position.x, position.y + 5, position.z);
        if (t >= 0.99) {
            currentLookAt.lerp(balconyTarget, 0.1);
        } else if (isScrolling) {
            const lookAheadT = Math.min(t + 0.05, 1);
            const lookAhead = pathCurve.getPointAt(lookAheadT);
            currentLookAt.lerp(lookAhead, 0.1);
            shouldLookAtBalcony = false;
        } else if (shouldLookAtBalcony) {
            currentLookAt.lerp(balconyTarget, 0.05);
        }
        camera.lookAt(currentLookAt);
    }
    
    renderer.render(scene, camera);
}

// Scroll event
const photoPairs = [
    {
        element: document.getElementById('photo-pair-1'),
        triggerPoint: 150,// Forest start
        duration: 300
    },
    {
        element: document.getElementById('photo-pair-2'),
        triggerPoint: 500, // Before cave
        duration: 300
    },
    {
        element: document.getElementById('photo-pair-3'),
        triggerPoint: 1000, // At waterfall
        duration: 300
    },
    {
        element: document.getElementById('photo-pair-4'),
        triggerPoint: 1400, // As path spirals up
        duration: 500
    }
];

const scrollText = document.getElementById('scroll-text');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    targetT = THREE.MathUtils.clamp(scrollY * 0.0005, 0, 1);
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        shouldLookAtBalcony = true;
    }, 4000);
    
    // Remove the data-at-end attribute setting
    document.body.removeAttribute('data-at-end');
    
    // Show photos at different scroll positions - back to original
    photoPairs.forEach(pair => {
        if (scrollY > pair.triggerPoint && scrollY < pair.triggerPoint + pair.duration) {
            pair.element.classList.add('active');
        } else {
            pair.element.classList.remove('active');
        }
    });
    
    // Handle scroll text - show only when we've reached the end of the path
    if (targetT >= 0.98) {
        scrollText.classList.add('active');
        scrollText.style.top = '50%'; // Position in the center
    } else {
        scrollText.classList.remove('active');
        scrollText.style.top = '-100px';
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add touch controls for mobile navigation
let touchStartY = 0;
let touchStartX = 0;
let virtualScrollY = 0; // Track virtual scroll position for touch devices

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    const deltaY = touchStartY - touchY;
    const deltaX = touchStartX - touchX;
    
    // Vertical swipe for path navigation
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // Scale the touch movement to appropriate scroll speed
        const scrollSpeed = 2.5;
        
        // Update virtual scroll position
        virtualScrollY += deltaY * scrollSpeed;
        virtualScrollY = Math.max(0, virtualScrollY);
        
        // Update target position along path
        targetT = THREE.MathUtils.clamp(virtualScrollY * 0.0005, 0, 1);
        
        // Remove the data-at-end setting
        document.body.removeAttribute('data-at-end');
        
        // Update touch start for continuous movement
        touchStartY = touchY;
        
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            shouldLookAtBalcony = true;
        }, 4000);
        
        // Show photos at different positions - back to original
        photoPairs.forEach(pair => {
            if (virtualScrollY > pair.triggerPoint && virtualScrollY < pair.triggerPoint + pair.duration) {
                pair.element.classList.add('active');
            } else {
                pair.element.classList.remove('active');
            }
        });
        
        // Handle scroll text - show only when we've reached the end of the path
        if (targetT >= 0.98) {
            scrollText.classList.add('active');
            scrollText.style.top = '50%'; // Position in the center
        } else {
            scrollText.classList.remove('active');
            scrollText.style.top = '-100px';
        }
    }
}, { passive: true });

// For devices without hover capability (mobile), make UI elements more touchable
if (isMobile) {
    const uiElements = document.querySelectorAll('.ui-button');
    uiElements.forEach(element => {
        element.style.padding = '15px';  // Larger touch targets
        element.style.margin = '10px';
    });
}

animate();

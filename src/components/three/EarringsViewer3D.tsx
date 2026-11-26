import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { GoldFinish } from './NecklaceViewer3D';

interface EarringsViewer3DProps {
  finish?: GoldFinish;
}

/* ─── helper: 3D floral rosette on a disc ─── */
function createFloralDisc(
  goldMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial,
  geos: THREE.BufferGeometry[]
): THREE.Group {
  const disc = new THREE.Group();

  // Domed face disc oriented toward +Z (front)
  const faceGeo = new THREE.SphereGeometry(0.42, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.5);
  faceGeo.rotateX(Math.PI / 2);
  faceGeo.scale(1, 1, 0.24);
  geos.push(faceGeo);
  const face = new THREE.Mesh(faceGeo, goldMat);
  face.castShadow = true;
  face.receiveShadow = true;
  disc.add(face);

  // Domed back disc oriented toward -Z (back)
  const backGeo = new THREE.SphereGeometry(0.42, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.5);
  backGeo.rotateX(-Math.PI / 2);
  backGeo.scale(1, 1, 0.14);
  geos.push(backGeo);
  const back = new THREE.Mesh(backGeo, goldMat);
  back.castShadow = true;
  disc.add(back);

  // Outer decorative border ring
  const borderGeo = new THREE.TorusGeometry(0.42, 0.028, 16, 64);
  geos.push(borderGeo);
  const border = new THREE.Mesh(borderGeo, accentMat);
  border.castShadow = true;
  disc.add(border);

  // Inner concentric ring
  const innerRingGeo = new THREE.TorusGeometry(0.32, 0.018, 14, 48);
  geos.push(innerRingGeo);
  const innerRing = new THREE.Mesh(innerRingGeo, accentMat);
  innerRing.position.z = 0.06;
  disc.add(innerRing);

  // Milgrain beads around outer border (front face)
  const milgrainCount = 36;
  const milgrainGeo = new THREE.SphereGeometry(0.016, 8, 8);
  geos.push(milgrainGeo);
  const milgrain = new THREE.InstancedMesh(milgrainGeo, accentMat, milgrainCount);
  milgrain.castShadow = true;
  const dummy = new THREE.Object3D();
  for (let i = 0; i < milgrainCount; i++) {
    const angle = (i / milgrainCount) * Math.PI * 2;
    dummy.position.set(Math.cos(angle) * 0.395, Math.sin(angle) * 0.395, 0.03);
    dummy.updateMatrix();
    milgrain.setMatrixAt(i, dummy.matrix);
  }
  milgrain.instanceMatrix.needsUpdate = true;
  disc.add(milgrain);

  // Central raised flower: 8-petal rosette
  const centerGeo = new THREE.SphereGeometry(0.065, 16, 16);
  centerGeo.scale(1, 1, 0.7);
  geos.push(centerGeo);
  const center = new THREE.Mesh(centerGeo, accentMat);
  center.position.z = 0.1;
  center.castShadow = true;
  disc.add(center);

  // Stamen halo
  const haloGeo = new THREE.TorusGeometry(0.08, 0.012, 10, 24);
  geos.push(haloGeo);
  const halo = new THREE.Mesh(haloGeo, goldMat);
  halo.position.z = 0.1;
  disc.add(halo);

  // 8 petals — elongated teardrops radiating from center
  const petalGeo = new THREE.SphereGeometry(0.055, 12, 12);
  petalGeo.scale(1.8, 0.75, 0.45);
  geos.push(petalGeo);
  const petalCount = 8;
  const petals = new THREE.InstancedMesh(petalGeo, goldMat, petalCount);
  petals.castShadow = true;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;
    const radius = 0.17;
    dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.08);
    dummy.rotation.set(0, 0, angle);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    petals.setMatrixAt(i, dummy.matrix);
  }
  petals.instanceMatrix.needsUpdate = true;
  disc.add(petals);

  // 8 secondary smaller petals (between primary petals)
  const sPetalGeo = new THREE.SphereGeometry(0.038, 10, 10);
  sPetalGeo.scale(1.5, 0.65, 0.4);
  geos.push(sPetalGeo);
  const sPetals = new THREE.InstancedMesh(sPetalGeo, accentMat, petalCount);
  sPetals.castShadow = true;
  for (let i = 0; i < petalCount; i++) {
    const angle = ((i + 0.5) / petalCount) * Math.PI * 2;
    const radius = 0.24;
    dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.065);
    dummy.rotation.set(0, 0, angle);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    sPetals.setMatrixAt(i, dummy.matrix);
  }
  sPetals.instanceMatrix.needsUpdate = true;
  disc.add(sPetals);

  // Granulation dot accents between petals near inner ring
  const dotGeo = new THREE.SphereGeometry(0.02, 10, 10);
  geos.push(dotGeo);
  const dots = new THREE.InstancedMesh(dotGeo, accentMat, petalCount);
  dots.castShadow = true;
  for (let i = 0; i < petalCount; i++) {
    const angle = ((i + 0.5) / petalCount) * Math.PI * 2;
    dummy.position.set(Math.cos(angle) * 0.3, Math.sin(angle) * 0.3, 0.06);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    dots.setMatrixAt(i, dummy.matrix);
  }
  dots.instanceMatrix.needsUpdate = true;
  disc.add(dots);

  return disc;
}

/* ─── helper: fish-hook earring wire ─── */
function createEarringHook(
  goldMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial,
  geos: THREE.BufferGeometry[]
): THREE.Group {
  const hook = new THREE.Group();

  // Main curved shepherd's hook wire
  const hookPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.22, 0.04),
    new THREE.Vector3(0, 0.46, 0.08),
    new THREE.Vector3(0, 0.72, 0.03),
    new THREE.Vector3(0, 0.88, -0.08),
    new THREE.Vector3(0, 0.76, -0.2),
    new THREE.Vector3(0, 0.56, -0.16),
    new THREE.Vector3(0, 0.48, -0.08),
  ]);
  const hookGeo = new THREE.TubeGeometry(hookPath, 48, 0.022, 14, false);
  geos.push(hookGeo);
  const hookMesh = new THREE.Mesh(hookGeo, goldMat);
  hookMesh.castShadow = true;
  hook.add(hookMesh);

  // Safety ball at the tip
  const ballGeo = new THREE.SphereGeometry(0.028, 12, 12);
  geos.push(ballGeo);
  const ball = new THREE.Mesh(ballGeo, accentMat);
  ball.position.set(0, 0.48, -0.08);
  hook.add(ball);

  // Decorative connection bead where hook meets disc
  const connGeo = new THREE.SphereGeometry(0.038, 12, 12);
  connGeo.scale(1, 0.7, 1);
  geos.push(connGeo);
  const conn = new THREE.Mesh(connGeo, accentMat);
  conn.position.set(0, 0.02, 0);
  conn.castShadow = true;
  hook.add(conn);

  return hook;
}

/* ─── helper: dangling ornamental drop below disc ─── */
function createDanglingDrop(
  goldMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial,
  geos: THREE.BufferGeometry[]
): THREE.Group {
  const drop = new THREE.Group();

  // Small jump ring connecting disc to drop
  const jumpGeo = new THREE.TorusGeometry(0.04, 0.012, 10, 20);
  geos.push(jumpGeo);
  const jump = new THREE.Mesh(jumpGeo, accentMat);
  jump.rotation.y = Math.PI / 2;
  jump.position.y = 0;
  drop.add(jump);

  // Connecting chain segment
  const chainGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.12, 12);
  geos.push(chainGeo);
  const chain = new THREE.Mesh(chainGeo, goldMat);
  chain.position.y = -0.1;
  chain.castShadow = true;
  drop.add(chain);

  // Teardrop shaped dangling charm using LatheGeometry
  const tearProfile = [
    new THREE.Vector2(0, -0.22),
    new THREE.Vector2(0.04, -0.18),
    new THREE.Vector2(0.075, -0.1),
    new THREE.Vector2(0.09, 0.0),
    new THREE.Vector2(0.085, 0.08),
    new THREE.Vector2(0.055, 0.14),
    new THREE.Vector2(0.02, 0.17),
    new THREE.Vector2(0, 0.18),
  ];
  const tearGeo = new THREE.LatheGeometry(tearProfile, 28);
  tearGeo.computeVertexNormals();
  geos.push(tearGeo);
  const tear = new THREE.Mesh(tearGeo, goldMat);
  tear.position.y = -0.34;
  tear.castShadow = true;
  drop.add(tear);

  // Decorative cap at the top of the teardrop
  const capGeo = new THREE.SphereGeometry(0.032, 12, 12);
  capGeo.scale(1.4, 0.6, 1.4);
  geos.push(capGeo);
  const cap = new THREE.Mesh(capGeo, accentMat);
  cap.position.y = -0.16;
  cap.castShadow = true;
  drop.add(cap);

  // Tiny accent bead at the very bottom
  const tipGeo = new THREE.SphereGeometry(0.022, 10, 10);
  geos.push(tipGeo);
  const tip = new THREE.Mesh(tipGeo, accentMat);
  tip.position.y = -0.56;
  drop.add(tip);

  return drop;
}

export default function EarringsViewer3D({ finish = '916' }: EarringsViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const goldMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const accentMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const [webglError, setWebglError] = useState(false);

  /* ─── finish switching effect ─── */
  useEffect(() => {
    const goldMat = goldMatRef.current;
    const accentMat = accentMatRef.current;
    if (!goldMat || !accentMat) return;

    if (finish === 'matte') {
      goldMat.color.set('#f5ae18');
      goldMat.metalness = 0.85;
      goldMat.roughness = 0.24;
      goldMat.clearcoat = 0.12;
      goldMat.envMapIntensity = 1.55;
      goldMat.emissive.set('#7a4800');
      goldMat.emissiveIntensity = 0.16;

      accentMat.color.set('#f5ae18');
      accentMat.metalness = 0.85;
      accentMat.roughness = 0.24;
      accentMat.clearcoat = 0.12;
      accentMat.envMapIntensity = 1.55;
      accentMat.emissive.set('#7a4800');
      accentMat.emissiveIntensity = 0.16;
    } else if (finish === 'two-tone') {
      goldMat.color.set('#ffc124');
      goldMat.metalness = 0.88;
      goldMat.roughness = 0.1;
      goldMat.clearcoat = 0.32;
      goldMat.envMapIntensity = 1.75;
      goldMat.emissive.set('#804c00');
      goldMat.emissiveIntensity = 0.18;

      accentMat.color.set('#f7f4ee');
      accentMat.metalness = 0.94;
      accentMat.roughness = 0.09;
      accentMat.clearcoat = 0.32;
      accentMat.envMapIntensity = 1.6;
      accentMat.emissive.set('#22201c');
      accentMat.emissiveIntensity = 0.04;
    } else {
      goldMat.color.set('#ffc124');
      goldMat.metalness = 0.88;
      goldMat.roughness = 0.1;
      goldMat.clearcoat = 0.32;
      goldMat.envMapIntensity = 1.75;
      goldMat.emissive.set('#804c00');
      goldMat.emissiveIntensity = 0.18;

      accentMat.color.set('#ffc124');
      accentMat.metalness = 0.88;
      accentMat.roughness = 0.1;
      accentMat.clearcoat = 0.32;
      accentMat.envMapIntensity = 1.75;
      accentMat.emissive.set('#804c00');
      accentMat.emissiveIntensity = 0.18;
    }
    goldMat.needsUpdate = true;
    accentMat.needsUpdate = true;
  }, [finish]);

  /* ─── main scene setup ─── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 640;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.42;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Environment map for realistic reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();

    // Camera positioned for elegant earring pair view
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 40);
    camera.position.set(0, 0.25, 7.2);
    cameraRef.current = camera;

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 3.2;
    controls.maxDistance = 10;
    controls.target.set(0, 0.12, 0);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.6;
    controlsRef.current = controls;

    const pauseAutoRotate = () => {
      controls.autoRotate = false;
    };
    controls.addEventListener('start', pauseAutoRotate);

    /* ─── warm golden studio lighting rig ─── */
    const ambient = new THREE.AmbientLight('#ffc43d', 0.45);
    scene.add(ambient);

    const hemiLight = new THREE.HemisphereLight('#fff2c6', '#c78c24', 1.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#ffebb3', 2.8);
    keyLight.position.set(4.5, 6.5, 5.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#ffdf8c', 1.45);
    fillLight.position.set(-4.5, 2.5, 4.0);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight('#ffd05b', 6.0, 18, Math.PI / 4, 0.65, 1);
    rimLight.position.set(-2.5, 4.5, -4.5);
    scene.add(rimLight);

    // Extra catch light for sparkle on the earring faces
    const catchLight = new THREE.PointLight('#ffe8b0', 1.8, 12, 2);
    catchLight.position.set(1.5, 2, 3);
    scene.add(catchLight);

    // Shadow catcher plane
    const shadowGeo = new THREE.PlaneGeometry(20, 20);
    const shadowMat = new THREE.ShadowMaterial({ color: '#4a3520', opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.set(0, -2.2, 0);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    /* ─── materials ─── */
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: '#ffc124',
      metalness: 0.88,
      roughness: finish === 'matte' ? 0.24 : 0.1,
      clearcoat: finish === 'matte' ? 0.12 : 0.32,
      clearcoatRoughness: 0.08,
      envMapIntensity: finish === 'matte' ? 1.55 : 1.75,
      emissive: new THREE.Color('#804c00'),
      emissiveIntensity: finish === 'matte' ? 0.16 : 0.18,
    });
    goldMatRef.current = goldMat;

    const accentMat = new THREE.MeshPhysicalMaterial({
      color: finish === 'two-tone' ? '#f7f4ee' : finish === 'matte' ? '#f5ae18' : '#ffc124',
      metalness: finish === 'two-tone' ? 0.94 : finish === 'matte' ? 0.85 : 0.88,
      roughness: finish === 'matte' ? 0.24 : 0.09,
      clearcoat: finish === 'matte' ? 0.12 : 0.32,
      clearcoatRoughness: 0.08,
      envMapIntensity: finish === 'two-tone' ? 1.6 : finish === 'matte' ? 1.55 : 1.75,
      emissive: new THREE.Color(finish === 'two-tone' ? '#22201c' : '#804c00'),
      emissiveIntensity: finish === 'two-tone' ? 0.04 : finish === 'matte' ? 0.16 : 0.18,
    });
    accentMatRef.current = accentMat;

    const disposableGeos: THREE.BufferGeometry[] = [];

    /* ─── earrings pair group ─── */
    const pairGroup = new THREE.Group();
    pairGroup.rotation.x = -0.06;
    scene.add(pairGroup);

    // Left earring (positioned left of center)
    const leftEarring = new THREE.Group();
    leftEarring.position.x = -0.95;

    const leftDisc = createFloralDisc(goldMat, accentMat, disposableGeos);
    leftEarring.add(leftDisc);

    const leftHook = createEarringHook(goldMat, accentMat, disposableGeos);
    leftHook.position.y = 0.42;
    leftEarring.add(leftHook);

    const leftDrop = createDanglingDrop(goldMat, accentMat, disposableGeos);
    leftDrop.position.y = -0.42;
    leftEarring.add(leftDrop);

    pairGroup.add(leftEarring);

    // Right earring (mirror of left, positioned right of center)
    const rightEarring = new THREE.Group();
    rightEarring.position.x = 0.95;

    const rightDisc = createFloralDisc(goldMat, accentMat, disposableGeos);
    rightEarring.add(rightDisc);

    const rightHook = createEarringHook(goldMat, accentMat, disposableGeos);
    rightHook.position.y = 0.42;
    // Mirror the hook on the X axis for the right earring
    rightHook.scale.x = -1;
    rightEarring.add(rightHook);

    const rightDrop = createDanglingDrop(goldMat, accentMat, disposableGeos);
    rightDrop.position.y = -0.42;
    rightEarring.add(rightDrop);

    pairGroup.add(rightEarring);

    // Slight elegant tilt on the right earring for natural catalogue look
    rightEarring.rotation.z = 0.04;
    leftEarring.rotation.z = -0.04;

    /* ─── animation loop ─── */
    let frameId = 0;
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', pauseAutoRotate);
      controls.dispose();
      disposableGeos.forEach((g) => g.dispose());
      shadowGeo.dispose();
      shadowMat.dispose();
      goldMat.dispose();
      accentMat.dispose();
      envTarget.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleResetView = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 0.25, 7.2);
    controlsRef.current.target.set(0, 0.12, 0);
    controlsRef.current.update();
  };

  if (webglError) {
    return (
      <div className="necklace-3d-fallback">
        <img src="/images/collection/earrings.webp" alt="Subang emas 916" />
      </div>
    );
  }

  return (
    <div className="necklace-3d-wrap">
      <div
        ref={containerRef}
        className="necklace-3d-canvas"
        role="img"
        aria-label="Model 3D interaktif sepasang subang emas 22K dengan corak bunga dan putaran 360 darjah"
      />
      <div className="necklace-3d-controls">
        <span>SERET UNTUK PUTAR 360° · SKROL UNTUK ZUM</span>
        <button type="button" onClick={handleResetView}>
          Reset sudut
        </button>
      </div>
    </div>
  );
}

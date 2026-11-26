import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { GoldFinish } from './NecklaceViewer3D';

interface PendantViewer3DProps {
  finish?: GoldFinish;
}

function getTeardropPoint(t: number, scaleX = 1.0, scaleY = 1.45): THREE.Vector3 {
  // Parametric teardrop: pointed apex at +Y (t = 0 / 2PI), full rounded base at -Y (t = PI)
  const theta = t * Math.PI * 2;
  const sinHalf = Math.sin(theta * 0.5);
  const x = Math.sin(theta) * Math.pow(Math.abs(sinHalf), 0.72) * scaleX;
  const y = Math.cos(theta) * scaleY * 0.85 - 0.12;
  return new THREE.Vector3(x, y, 0);
}

function createTeardropCurve(scaleX: number, scaleY: number, steps = 64): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < steps; i++) {
    pts.push(getTeardropPoint(i / steps, scaleX, scaleY));
  }
  return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
}

function createBailAssembly(
  goldMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial
): THREE.Group {
  const bail = new THREE.Group();

  // Connecting jump ring between pendant apex and bail
  const jumpGeo = new THREE.TorusGeometry(0.11, 0.026, 14, 32);
  const jumpRing = new THREE.Mesh(jumpGeo, accentMat);
  jumpRing.position.set(0, 1.16, 0);
  jumpRing.rotation.y = Math.PI / 2;
  jumpRing.castShadow = true;
  bail.add(jumpRing);

  // Sculpted tapered bail loop (front-to-back oval)
  const bailPath = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 1.24, -0.04),
      new THREE.Vector3(0, 1.44, -0.14),
      new THREE.Vector3(0, 1.72, -0.11),
      new THREE.Vector3(0, 1.84, 0.0),
      new THREE.Vector3(0, 1.72, 0.11),
      new THREE.Vector3(0, 1.44, 0.14),
      new THREE.Vector3(0, 1.24, 0.04),
    ],
    true,
    'catmullrom',
    0.5
  );
  const bailGeo = new THREE.TubeGeometry(bailPath, 48, 0.048, 16, true);
  const bailMesh = new THREE.Mesh(bailGeo, goldMat);
  bailMesh.scale.set(1.35, 1, 1);
  bailMesh.castShadow = true;
  bail.add(bailMesh);

  // Decorative raised gold filigree rib down the front of the bail
  const ribPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.26, 0.075),
    new THREE.Vector3(0, 1.48, 0.185),
    new THREE.Vector3(0, 1.73, 0.145),
    new THREE.Vector3(0, 1.85, 0.02),
  ]);
  const ribGeo = new THREE.TubeGeometry(ribPath, 24, 0.022, 12, false);
  const ribMesh = new THREE.Mesh(ribGeo, accentMat);
  ribMesh.castShadow = true;
  bail.add(ribMesh);

  // Micro-beads framing the bail rib
  const beadGeo = new THREE.SphereGeometry(0.019, 10, 10);
  for (let i = 0; i < 5; i++) {
    const u = 0.15 + i * 0.18;
    const p = ribPath.getPointAt(u);
    const leftBead = new THREE.Mesh(beadGeo, accentMat);
    leftBead.position.set(p.x - 0.048, p.y, p.z - 0.01);
    bail.add(leftBead);

    const rightBead = new THREE.Mesh(beadGeo, accentMat);
    rightBead.position.set(p.x + 0.048, p.y, p.z - 0.01);
    bail.add(rightBead);
  }

  return bail;
}

export default function PendantViewer3D({ finish = '916' }: PendantViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const goldMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const accentMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const [webglError, setWebglError] = useState(false);

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

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 45);
    camera.position.set(1.25, 0.65, 5.4);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.8;
    controls.maxDistance = 9.5;
    controls.target.set(0, 0.15, 0);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.65;
    controlsRef.current = controls;

    const pauseAutoRotate = () => {
      controls.autoRotate = false;
    };
    controls.addEventListener('start', pauseAutoRotate);

    // Warm golden studio lighting
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
    keyLight.shadow.camera.left = -3.5;
    keyLight.shadow.camera.right = 3.5;
    keyLight.shadow.camera.top = 3.5;
    keyLight.shadow.camera.bottom = -3.5;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#ffdf8c', 1.45);
    fillLight.position.set(-4.5, 2.5, 4.0);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight('#ffd05b', 6.0, 18, Math.PI / 4, 0.65, 1);
    rimLight.position.set(-2.5, 4.5, -4.5);
    scene.add(rimLight);

    const shadowGeo = new THREE.PlaneGeometry(20, 20);
    const shadowMat = new THREE.ShadowMaterial({ color: '#4a3520', opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.set(0, -1.75, 0);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

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

    const pendantGroup = new THREE.Group();
    pendantGroup.rotation.x = -0.08;
    scene.add(pendantGroup);

    const disposableGeos: THREE.BufferGeometry[] = [];

    // 1. Outer & inner sculpted teardrop frames
    const outerCurve = createTeardropCurve(1.06, 1.48);
    const outerFrameGeo = new THREE.TubeGeometry(outerCurve, 96, 0.056, 18, true);
    disposableGeos.push(outerFrameGeo);
    const outerFrame = new THREE.Mesh(outerFrameGeo, goldMat);
    outerFrame.castShadow = true;
    outerFrame.receiveShadow = true;
    pendantGroup.add(outerFrame);

    const innerCurve = createTeardropCurve(0.88, 1.24);
    const innerFrameGeo = new THREE.TubeGeometry(innerCurve, 84, 0.032, 14, true);
    disposableGeos.push(innerFrameGeo);
    const innerFrame = new THREE.Mesh(innerFrameGeo, accentMat);
    innerFrame.castShadow = true;
    pendantGroup.add(innerFrame);

    // 2. Milgrain border beads along outer teardrop rim (front & back)
    const rimBeadCount = 56;
    const rimBeadGeo = new THREE.SphereGeometry(0.025, 10, 10);
    disposableGeos.push(rimBeadGeo);
    const rimBeads = new THREE.InstancedMesh(rimBeadGeo, accentMat, rimBeadCount * 2);
    rimBeads.castShadow = true;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < rimBeadCount; i++) {
      const p = outerCurve.getPointAt(i / rimBeadCount);
      dummy.position.set(p.x, p.y, 0.046);
      dummy.updateMatrix();
      rimBeads.setMatrixAt(i * 2, dummy.matrix);

      dummy.position.set(p.x, p.y, -0.046);
      dummy.updateMatrix();
      rimBeads.setMatrixAt(i * 2 + 1, dummy.matrix);
    }
    rimBeads.instanceMatrix.needsUpdate = true;
    pendantGroup.add(rimBeads);

    // 3. Central 8-petal 3D lotus rosette
    const flowerCenterY = -0.34;
    const stamenGeo = new THREE.SphereGeometry(0.11, 20, 20);
    stamenGeo.scale(1, 1, 0.65);
    disposableGeos.push(stamenGeo);
    const stamen = new THREE.Mesh(stamenGeo, goldMat);
    stamen.position.set(0, flowerCenterY, 0);
    stamen.castShadow = true;
    pendantGroup.add(stamen);

    const haloGeo = new THREE.TorusGeometry(0.14, 0.018, 12, 32);
    disposableGeos.push(haloGeo);
    const halo = new THREE.Mesh(haloGeo, accentMat);
    halo.position.set(0, flowerCenterY, 0.02);
    pendantGroup.add(halo);

    const petalGeo = new THREE.SphereGeometry(0.085, 14, 14);
    petalGeo.scale(1.65, 0.72, 0.42);
    disposableGeos.push(petalGeo);
    const petalCount = 8;
    const petals = new THREE.InstancedMesh(petalGeo, goldMat, petalCount);
    petals.castShadow = true;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      dummy.position.set(
        Math.cos(angle) * 0.25,
        flowerCenterY + Math.sin(angle) * 0.25,
        0
      );
      dummy.rotation.set(0, 0, angle);
      dummy.updateMatrix();
      petals.setMatrixAt(i, dummy.matrix);
    }
    petals.instanceMatrix.needsUpdate = true;
    pendantGroup.add(petals);

    // 4. Symmetrical 3D filigree scroll volutes (left & right mirrored)
    const scrollDefinitions: THREE.Vector3[][] = [
      // Upper crown scroll
      [
        new THREE.Vector3(0.0, 0.88, 0),
        new THREE.Vector3(0.20, 0.68, 0.02),
        new THREE.Vector3(0.32, 0.42, 0.01),
        new THREE.Vector3(0.18, 0.24, 0),
        new THREE.Vector3(0.08, 0.34, 0.01),
      ],
      // Middle side wing scroll
      [
        new THREE.Vector3(0.28, 0.14, 0),
        new THREE.Vector3(0.56, 0.08, 0.02),
        new THREE.Vector3(0.72, -0.18, 0),
        new THREE.Vector3(0.54, -0.36, -0.01),
        new THREE.Vector3(0.42, -0.22, 0.01),
      ],
      // Lower sweeping base scroll
      [
        new THREE.Vector3(0.0, -1.26, 0),
        new THREE.Vector3(0.36, -1.16, 0.02),
        new THREE.Vector3(0.68, -0.84, 0),
        new THREE.Vector3(0.52, -0.56, -0.01),
        new THREE.Vector3(0.32, -0.68, 0.01),
      ],
      // Connecting bridge to inner frame
      [
        new THREE.Vector3(0.0, -0.62, 0),
        new THREE.Vector3(0.16, -0.86, 0.01),
        new THREE.Vector3(0.0, -1.08, 0),
      ],
    ];

    const dotGeo = new THREE.SphereGeometry(0.036, 12, 12);
    disposableGeos.push(dotGeo);

    scrollDefinitions.forEach((pts) => {
      [-1, 1].forEach((side) => {
        const mirrored = pts.map((p) => new THREE.Vector3(p.x * side, p.y, p.z));
        const scrollCurve = new THREE.CatmullRomCurve3(mirrored, false, 'catmullrom', 0.5);
        const scrollGeo = new THREE.TubeGeometry(scrollCurve, 36, 0.024, 12, false);
        disposableGeos.push(scrollGeo);
        const scrollMesh = new THREE.Mesh(scrollGeo, accentMat);
        scrollMesh.castShadow = true;
        pendantGroup.add(scrollMesh);

        // Granulation bead at the curled tip of each scroll
        const tip = mirrored[mirrored.length - 1];
        const tipDot = new THREE.Mesh(dotGeo, goldMat);
        tipDot.position.copy(tip);
        tipDot.castShadow = true;
        pendantGroup.add(tipDot);
      });
    });

    // 5. Detailed pendant bail at the top
    const bailAssembly = createBailAssembly(goldMat, accentMat);
    pendantGroup.add(bailAssembly);

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
    cameraRef.current.position.set(1.25, 0.65, 5.4);
    controlsRef.current.target.set(0, 0.15, 0);
    controlsRef.current.update();
  };

  if (webglError) {
    return (
      <div className="necklace-3d-fallback">
        <img src="/images/collection/pendants.webp" alt="Loket emas 916" />
      </div>
    );
  }

  return (
    <div className="necklace-3d-wrap">
      <div
        ref={containerRef}
        className="necklace-3d-canvas"
        role="img"
        aria-label="Model 3D interaktif loket emas 22K kerawang bunga dengan putaran 360 darjah"
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

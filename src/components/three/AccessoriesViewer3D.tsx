import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { GoldFinish } from './NecklaceViewer3D';

interface AccessoriesViewer3DProps {
  finish?: GoldFinish;
}

type AccessoryId = 'all' | 'orchid' | 'charm' | 'connector' | 'pin';

const accessoryOptions: { id: AccessoryId; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'orchid', label: 'Bros Orkid' },
  { id: 'charm', label: 'Loket Bunga' },
  { id: 'connector', label: 'Penyambung' },
  { id: 'pin', label: 'Kerongsang' },
];

function createAccessoryMaterial(finish: GoldFinish, isAccent = false): THREE.MeshPhysicalMaterial {
  if (finish === 'matte') {
    return new THREE.MeshPhysicalMaterial({
      color: '#f5ae18',
      metalness: 0.85,
      roughness: 0.24,
      clearcoat: 0.12,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.55,
      emissive: new THREE.Color('#7a4800'),
      emissiveIntensity: 0.16,
    });
  }
  if (finish === 'two-tone' && isAccent) {
    return new THREE.MeshPhysicalMaterial({
      color: '#f7f4ee',
      metalness: 0.94,
      roughness: 0.09,
      clearcoat: 0.32,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.6,
      emissive: new THREE.Color('#22201c'),
      emissiveIntensity: 0.04,
    });
  }
  return new THREE.MeshPhysicalMaterial({
    color: '#ffc124',
    metalness: 0.88,
    roughness: 0.1,
    clearcoat: 0.32,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.75,
    emissive: new THREE.Color('#804c00'),
    emissiveIntensity: 0.18,
  });
}

function applyFinishToMaterial(mat: THREE.MeshPhysicalMaterial, finish: GoldFinish, isAccent = false) {
  if (finish === 'matte') {
    mat.color.set('#f5ae18');
    mat.metalness = 0.85;
    mat.roughness = 0.24;
    mat.clearcoat = 0.12;
    mat.envMapIntensity = 1.55;
    mat.emissive.set('#7a4800');
    mat.emissiveIntensity = 0.16;
  } else if (finish === 'two-tone' && isAccent) {
    mat.color.set('#f7f4ee');
    mat.metalness = 0.94;
    mat.roughness = 0.09;
    mat.clearcoat = 0.32;
    mat.envMapIntensity = 1.6;
    mat.emissive.set('#22201c');
    mat.emissiveIntensity = 0.04;
  } else {
    mat.color.set('#ffc124');
    mat.metalness = 0.88;
    mat.roughness = 0.1;
    mat.clearcoat = 0.32;
    mat.envMapIntensity = 1.75;
    mat.emissive.set('#804c00');
    mat.emissiveIntensity = 0.18;
  }
  mat.needsUpdate = true;
}

function buildOrchidBrooch(
  primaryMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial,
  geos: THREE.BufferGeometry[]
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'orchid';

  // 5 sculpted orchid petals
  const petalShape = new THREE.Shape();
  petalShape.moveTo(0, 0);
  petalShape.bezierCurveTo(0.18, 0.12, 0.24, 0.42, 0.0, 0.58);
  petalShape.bezierCurveTo(-0.24, 0.42, -0.18, 0.12, 0, 0);

  const petalGeo = new THREE.ExtrudeGeometry(petalShape, {
    depth: 0.025,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
  });
  geos.push(petalGeo);

  const petalAngles = [0, 1.22, -1.22, 2.35, -2.35];
  petalAngles.forEach((angle, idx) => {
    const petal = new THREE.Mesh(petalGeo, primaryMat);
    petal.rotation.z = angle;
    petal.rotation.x = idx === 0 ? -0.18 : -0.1;
    petal.scale.set(idx < 3 ? 1 : 0.85, idx < 3 ? 1 : 0.85, 1);
    petal.castShadow = true;
    group.add(petal);
  });

  // Ruffled central labellum cup
  const cupGeo = new THREE.TorusGeometry(0.11, 0.042, 14, 28);
  geos.push(cupGeo);
  const cup = new THREE.Mesh(cupGeo, accentMat);
  cup.position.set(0, -0.04, 0.055);
  cup.castShadow = true;
  group.add(cup);

  const stamenGeo = new THREE.SphereGeometry(0.055, 16, 16);
  geos.push(stamenGeo);
  const stamen = new THREE.Mesh(stamenGeo, primaryMat);
  stamen.position.set(0, -0.02, 0.075);
  group.add(stamen);

  // Curved golden stem & bud
  const stemPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.05, -0.02),
    new THREE.Vector3(0.14, -0.34, -0.01),
    new THREE.Vector3(0.32, -0.58, 0.01),
  ]);
  const stemGeo = new THREE.TubeGeometry(stemPath, 24, 0.024, 12, false);
  geos.push(stemGeo);
  const stem = new THREE.Mesh(stemGeo, accentMat);
  stem.castShadow = true;
  group.add(stem);

  const budGeo = new THREE.SphereGeometry(0.065, 14, 14);
  budGeo.scale(0.85, 1.35, 0.85);
  geos.push(budGeo);
  const bud = new THREE.Mesh(budGeo, primaryMat);
  bud.position.set(0.34, -0.60, 0.02);
  bud.rotation.z = -0.6;
  bud.castShadow = true;
  group.add(bud);

  return group;
}

function buildFloralCharm(
  primaryMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial,
  geos: THREE.BufferGeometry[]
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'charm';

  // Top jump ring
  const ringGeo = new THREE.TorusGeometry(0.085, 0.02, 12, 28);
  geos.push(ringGeo);
  const ring = new THREE.Mesh(ringGeo, accentMat);
  ring.position.set(0, 0.44, 0);
  ring.castShadow = true;
  group.add(ring);

  // Outer beaded halo
  const haloGeo = new THREE.TorusGeometry(0.32, 0.024, 14, 36);
  geos.push(haloGeo);
  const halo = new THREE.Mesh(haloGeo, accentMat);
  halo.castShadow = true;
  group.add(halo);

  // 6 sculpted petals
  const petalGeo = new THREE.SphereGeometry(0.11, 16, 16);
  petalGeo.scale(1.35, 0.72, 0.42);
  geos.push(petalGeo);

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const petal = new THREE.Mesh(petalGeo, primaryMat);
    petal.position.set(Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0);
    petal.rotation.z = a;
    petal.castShadow = true;
    group.add(petal);
  }

  const centerGeo = new THREE.SphereGeometry(0.075, 16, 16);
  centerGeo.scale(1, 1, 0.65);
  geos.push(centerGeo);
  const center = new THREE.Mesh(centerGeo, accentMat);
  center.position.z = 0.02;
  group.add(center);

  return group;
}

function buildOrnamentalConnector(
  primaryMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial,
  geos: THREE.BufferGeometry[]
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'connector';

  // Symmetrical diamond filigree frame
  const diamondPath = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-0.44, 0, 0),
      new THREE.Vector3(0, 0.24, 0),
      new THREE.Vector3(0.44, 0, 0),
      new THREE.Vector3(0, -0.24, 0),
    ],
    true,
    'catmullrom',
    0.2
  );
  const frameGeo = new THREE.TubeGeometry(diamondPath, 48, 0.032, 14, true);
  geos.push(frameGeo);
  const frame = new THREE.Mesh(frameGeo, primaryMat);
  frame.castShadow = true;
  group.add(frame);

  // End connection loops
  const endLoopGeo = new THREE.TorusGeometry(0.08, 0.02, 12, 24);
  geos.push(endLoopGeo);
  [-0.53, 0.53].forEach((x) => {
    const loop = new THREE.Mesh(endLoopGeo, accentMat);
    loop.position.set(x, 0, 0);
    loop.castShadow = true;
    group.add(loop);
  });

  // Inner filigree cross & central cabochon
  const innerRingGeo = new THREE.TorusGeometry(0.11, 0.02, 12, 24);
  geos.push(innerRingGeo);
  const innerRing = new THREE.Mesh(innerRingGeo, accentMat);
  innerRing.castShadow = true;
  group.add(innerRing);

  const beadGeo = new THREE.SphereGeometry(0.045, 14, 14);
  geos.push(beadGeo);
  const centerBead = new THREE.Mesh(beadGeo, primaryMat);
  group.add(centerBead);

  [-0.22, 0.22].forEach((x) => {
    const sideBead = new THREE.Mesh(beadGeo, accentMat);
    sideBead.scale.set(0.65, 0.65, 0.65);
    sideBead.position.set(x, 0, 0);
    group.add(sideBead);
  });

  return group;
}

function buildCrescentPin(
  primaryMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial,
  geos: THREE.BufferGeometry[]
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'pin';

  // Sculpted crescent moon arc
  const crescentPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.12, 0.36, 0),
    new THREE.Vector3(-0.18, 0.22, 0),
    new THREE.Vector3(-0.26, 0.0, 0),
    new THREE.Vector3(-0.18, -0.22, 0),
    new THREE.Vector3(0.12, -0.36, 0),
  ]);
  const crescentGeo = new THREE.TubeGeometry(crescentPath, 36, 0.048, 16, false);
  geos.push(crescentGeo);
  const crescent = new THREE.Mesh(crescentGeo, primaryMat);
  crescent.castShadow = true;
  group.add(crescent);

  // 8-point star accent nestled in the crescent
  const rayGeo = new THREE.ConeGeometry(0.036, 0.22, 6);
  geos.push(rayGeo);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const ray = new THREE.Mesh(rayGeo, accentMat);
    ray.position.set(0.14 + Math.cos(a) * 0.08, Math.sin(a) * 0.08, 0.02);
    ray.rotation.z = a - Math.PI / 2;
    ray.scale.set(1, i % 2 === 0 ? 1 : 0.68, 0.6);
    ray.castShadow = true;
    group.add(ray);
  }

  const centerGeo = new THREE.SphereGeometry(0.045, 14, 14);
  geos.push(centerGeo);
  const center = new THREE.Mesh(centerGeo, primaryMat);
  center.position.set(0.14, 0, 0.02);
  group.add(center);

  return group;
}

const cameraPresets: Record<AccessoryId, { pos: [number, number, number]; target: [number, number, number] }> = {
  all: { pos: [0.4, 1.35, 5.2], target: [0, 0.0, 0] },
  orchid: { pos: [-0.85, 0.6, 2.7], target: [-1.15, 0.25, 0.15] },
  charm: { pos: [1.3, 0.55, 2.5], target: [1.15, 0.22, 0.2] },
  connector: { pos: [-0.7, 0.35, 2.5], target: [-0.95, -0.68, 0.4] },
  pin: { pos: [1.15, 0.35, 2.5], target: [0.95, -0.65, 0.35] },
};

export default function AccessoriesViewer3D({ finish = '916' }: AccessoriesViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialsRef = useRef<{ primary: THREE.MeshPhysicalMaterial; accent: THREE.MeshPhysicalMaterial }[]>([]);
  const targetGoalRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);

  const [selectedId, setSelectedId] = useState<AccessoryId>('all');
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    materialsRef.current.forEach(({ primary, accent }) => {
      applyFinishToMaterial(primary, finish, false);
      applyFinishToMaterial(accent, finish, true);
    });
  }, [finish]);

  useEffect(() => {
    const preset = cameraPresets[selectedId];
    targetGoalRef.current = {
      pos: new THREE.Vector3(...preset.pos),
      target: new THREE.Vector3(...preset.target),
    };
    if (controlsRef.current) {
      controlsRef.current.autoRotate = selectedId === 'all' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, [selectedId]);

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
    camera.position.set(...cameraPresets.all.pos);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 1.6;
    controls.maxDistance = 9.0;
    controls.target.set(...cameraPresets.all.target);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.55;
    controlsRef.current = controls;

    const pauseAutoRotate = () => {
      controls.autoRotate = false;
      targetGoalRef.current = null;
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

    const shadowGeo = new THREE.PlaneGeometry(20, 20);
    const shadowMat = new THREE.ShadowMaterial({ color: '#4a3520', opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.set(0, -1.25, 0);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const disposableGeos: THREE.BufferGeometry[] = [];
    const mats: { primary: THREE.MeshPhysicalMaterial; accent: THREE.MeshPhysicalMaterial }[] = [];

    // Each accessory is a separate 3D object with its own geometry & material
    const orchidMats = { primary: createAccessoryMaterial(finish, false), accent: createAccessoryMaterial(finish, true) };
    mats.push(orchidMats);
    const orchid = buildOrchidBrooch(orchidMats.primary, orchidMats.accent, disposableGeos);
    orchid.position.set(-1.15, 0.25, 0.15);
    orchid.rotation.set(-0.25, 0.2, 0.08);
    scene.add(orchid);

    const charmMats = { primary: createAccessoryMaterial(finish, false), accent: createAccessoryMaterial(finish, true) };
    mats.push(charmMats);
    const charm = buildFloralCharm(charmMats.primary, charmMats.accent, disposableGeos);
    charm.position.set(1.15, 0.22, 0.2);
    charm.rotation.set(-0.22, -0.22, -0.05);
    scene.add(charm);

    const connectorMats = { primary: createAccessoryMaterial(finish, false), accent: createAccessoryMaterial(finish, true) };
    mats.push(connectorMats);
    const connector = buildOrnamentalConnector(connectorMats.primary, connectorMats.accent, disposableGeos);
    connector.position.set(-0.95, -0.68, 0.4);
    connector.rotation.set(-0.48, 0.15, 0.12);
    scene.add(connector);

    const pinMats = { primary: createAccessoryMaterial(finish, false), accent: createAccessoryMaterial(finish, true) };
    mats.push(pinMats);
    const pin = buildCrescentPin(pinMats.primary, pinMats.accent, disposableGeos);
    pin.position.set(0.95, -0.65, 0.35);
    pin.rotation.set(-0.45, -0.18, -0.1);
    scene.add(pin);

    materialsRef.current = mats;

    const selectableRoots = [orchid, charm, connector, pin];
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const onPointerDown = (event: PointerEvent) => {
      downPos = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = (event: PointerEvent) => {
      const moved = Math.abs(event.clientX - downPos.x) + Math.abs(event.clientY - downPos.y);
      if (moved > 6) return; // Ignore drag gestures

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(selectableRoots, true);
      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && !obj.name) obj = obj.parent;
        if (obj?.name) {
          setSelectedId(obj.name as AccessoryId);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    let frameId = 0;
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      if (targetGoalRef.current) {
        camera.position.lerp(targetGoalRef.current.pos, 0.08);
        controls.target.lerp(targetGoalRef.current.target, 0.08);
        if (
          camera.position.distanceTo(targetGoalRef.current.pos) < 0.02 &&
          controls.target.distanceTo(targetGoalRef.current.target) < 0.02
        ) {
          targetGoalRef.current = null;
        }
      }
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
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.removeEventListener('start', pauseAutoRotate);
      controls.dispose();
      disposableGeos.forEach((g) => g.dispose());
      shadowGeo.dispose();
      shadowMat.dispose();
      mats.forEach(({ primary, accent }) => {
        primary.dispose();
        accent.dispose();
      });
      envTarget.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleResetView = () => {
    setSelectedId('all');
    targetGoalRef.current = {
      pos: new THREE.Vector3(...cameraPresets.all.pos),
      target: new THREE.Vector3(...cameraPresets.all.target),
    };
  };

  if (webglError) {
    return (
      <div className="necklace-3d-fallback">
        <img src="/images/collection/accessories.webp" alt="Aksesori emas 916" />
      </div>
    );
  }

  return (
    <div className="necklace-3d-wrap">
      <div
        ref={containerRef}
        className="necklace-3d-canvas"
        role="img"
        aria-label="Koleksi 3D interaktif aksesori emas 22K dengan pilihan objek dan putaran 360 darjah"
      />
      <div className="necklace-3d-controls">
        <span>TEKAN OBJEK ATAU SERET 360°</span>
        <button type="button" onClick={handleResetView}>
          Reset sudut
        </button>
      </div>
      <div className="accessories-3d-selector" role="group" aria-label="Pilih aksesori 3D">
        {accessoryOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selectedId === item.id}
            onClick={() => setSelectedId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

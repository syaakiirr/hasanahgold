import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { GoldFinish } from './NecklaceViewer3D';

interface RingViewer3DProps {
  finish?: GoldFinish;
}

function createEngravingTextures(): { bumpMap: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } {
  const width = 1024;
  const height = 256;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rCtx = roughCanvas.getContext('2d')!;

  // Base polished surface
  bCtx.fillStyle = '#c8c8c8';
  bCtx.fillRect(0, 0, width, height);
  rCtx.fillStyle = '#181818';
  rCtx.fillRect(0, 0, width, height);

  // Subtle recessed engraving channel along the middle of the outer band
  const bandTop = height * 0.24;
  const bandBottom = height * 0.76;
  const bandMid = height * 0.5;

  // Fine border grooves
  bCtx.strokeStyle = '#404040';
  bCtx.lineWidth = 4;
  bCtx.beginPath();
  bCtx.moveTo(0, bandTop);
  bCtx.lineTo(width, bandTop);
  bCtx.moveTo(0, bandBottom);
  bCtx.lineTo(width, bandBottom);
  bCtx.stroke();

  rCtx.strokeStyle = '#707070';
  rCtx.lineWidth = 4;
  rCtx.beginPath();
  rCtx.moveTo(0, bandTop);
  rCtx.lineTo(width, bandTop);
  rCtx.moveTo(0, bandBottom);
  rCtx.lineTo(width, bandBottom);
  rCtx.stroke();

  // Repeating botanical scroll & diamond filigree pattern
  const repeats = 16;
  const step = width / repeats;
  for (let i = 0; i < repeats; i++) {
    const cx = (i + 0.5) * step;

    // Engraved diamond / leaf motif
    bCtx.strokeStyle = '#525252';
    bCtx.lineWidth = 3.2;
    bCtx.beginPath();
    bCtx.moveTo(cx - step * 0.42, bandMid);
    bCtx.quadraticCurveTo(cx, bandTop + 14, cx + step * 0.42, bandMid);
    bCtx.quadraticCurveTo(cx, bandBottom - 14, cx - step * 0.42, bandMid);
    bCtx.stroke();

    // Inner petal dot
    bCtx.fillStyle = '#ffffff';
    bCtx.beginPath();
    bCtx.arc(cx, bandMid, 6.5, 0, Math.PI * 2);
    bCtx.fill();

    // Fine diagonal cross-hatching in recesses
    bCtx.strokeStyle = '#6a6a6a';
    bCtx.lineWidth = 1.6;
    bCtx.beginPath();
    bCtx.moveTo(cx - step * 0.22, bandTop + 10);
    bCtx.lineTo(cx - step * 0.08, bandMid - 10);
    bCtx.moveTo(cx + step * 0.22, bandBottom - 10);
    bCtx.lineTo(cx + step * 0.08, bandMid + 10);
    bCtx.stroke();

    // Matching roughness variation (recesses slightly more satin)
    rCtx.strokeStyle = '#646464';
    rCtx.lineWidth = 3.2;
    rCtx.beginPath();
    rCtx.moveTo(cx - step * 0.42, bandMid);
    rCtx.quadraticCurveTo(cx, bandTop + 14, cx + step * 0.42, bandMid);
    rCtx.quadraticCurveTo(cx, bandBottom - 14, cx - step * 0.42, bandMid);
    rCtx.stroke();
  }

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;
  bumpMap.repeat.set(2, 1);

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.ClampToEdgeWrapping;
  roughnessMap.repeat.set(2, 1);

  return { bumpMap, roughnessMap };
}

function createRingBandGeometry(
  innerRadius = 1.05,
  outerRadius = 1.24,
  bandWidth = 0.42,
  radialSegments = 128
): THREE.BufferGeometry {
  // Closed comfort-fit D-profile cross-section revolved around Y-axis
  const halfW = bandWidth / 2;
  const profile: THREE.Vector2[] = [];

  // Inner comfort-fit arc (from bottom to top)
  const innerSteps = 12;
  for (let i = 0; i <= innerSteps; i++) {
    const t = i / innerSteps;
    const y = -halfW * 0.92 + t * (halfW * 1.84);
    const bulge = Math.sin(t * Math.PI) * 0.025;
    profile.push(new THREE.Vector2(innerRadius + bulge, y));
  }

  // Top chamfered shoulder
  profile.push(new THREE.Vector2(innerRadius + 0.035, halfW));
  profile.push(new THREE.Vector2(outerRadius - 0.045, halfW));

  // Outer gently domed profile (top to bottom)
  const outerSteps = 16;
  for (let i = 0; i <= outerSteps; i++) {
    const t = i / outerSteps;
    const y = halfW * 0.92 - t * (halfW * 1.84);
    const dome = Math.sin(t * Math.PI) * 0.038;
    profile.push(new THREE.Vector2(outerRadius + dome, y));
  }

  // Bottom chamfered shoulder back to start
  profile.push(new THREE.Vector2(outerRadius - 0.045, -halfW));
  profile.push(new THREE.Vector2(innerRadius + 0.035, -halfW));
  profile.push(profile[0].clone());

  const geo = new THREE.LatheGeometry(profile, radialSegments);
  geo.computeVertexNormals();
  return geo;
}

function createGemstoneCrown(
  goldMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial,
  gemMat: THREE.MeshPhysicalMaterial
): THREE.Group {
  const crown = new THREE.Group();

  // Gallery bezel base sitting on the top outer surface of the band
  const galleryGeo = new THREE.CylinderGeometry(0.24, 0.16, 0.14, 32);
  const gallery = new THREE.Mesh(galleryGeo, accentMat);
  gallery.position.y = 0.04;
  gallery.castShadow = true;
  crown.add(gallery);

  const collarGeo = new THREE.TorusGeometry(0.22, 0.022, 14, 36);
  const collar = new THREE.Mesh(collarGeo, goldMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.11;
  crown.add(collar);

  // 4 sculpted prongs embracing the gemstone
  const prongAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
  prongAngles.forEach((angle) => {
    const r0 = 0.18;
    const r1 = 0.265;
    const r2 = 0.225;
    const prongPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(angle) * r0, 0.0, Math.sin(angle) * r0),
      new THREE.Vector3(Math.cos(angle) * r1, 0.18, Math.sin(angle) * r1),
      new THREE.Vector3(Math.cos(angle) * r2, 0.30, Math.sin(angle) * r2),
    ]);
    const prongGeo = new THREE.TubeGeometry(prongPath, 16, 0.026, 12, false);
    const prong = new THREE.Mesh(prongGeo, accentMat);
    prong.castShadow = true;
    crown.add(prong);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), accentMat);
    tip.position.set(Math.cos(angle) * r2, 0.30, Math.sin(angle) * r2);
    crown.add(tip);
  });

  // Brilliant-cut faceted gemstone using LatheGeometry with 16 facets
  const gemProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.23, 0.17),
    new THREE.Vector2(0.23, 0.195),
    new THREE.Vector2(0.145, 0.265),
    new THREE.Vector2(0.0, 0.265),
  ];
  const gemGeo = new THREE.LatheGeometry(gemProfile, 16);
  gemGeo.computeVertexNormals();
  const gem = new THREE.Mesh(gemGeo, gemMat);
  gem.position.y = 0.06;
  gem.castShadow = true;
  crown.add(gem);

  return crown;
}

export default function RingViewer3D({ finish = '916' }: RingViewer3DProps) {
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

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    camera.position.set(2.5, 1.85, 4.35);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.6;
    controls.maxDistance = 8.0;
    controls.target.set(0, 0.12, 0);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.75;
    controlsRef.current = controls;

    const pauseAutoRotate = () => {
      controls.autoRotate = false;
    };
    controls.addEventListener('start', pauseAutoRotate);

    // Warm golden softbox studio lighting
    const ambient = new THREE.AmbientLight('#ffc43d', 0.45);
    scene.add(ambient);

    const hemiLight = new THREE.HemisphereLight('#fff2c6', '#c78c24', 1.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#ffebb3', 2.8);
    keyLight.position.set(4.0, 6.0, 5.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#ffdf8c', 1.45);
    fillLight.position.set(-4.5, 2.5, 4.0);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight('#ffd05b', 6.0, 16, Math.PI / 4, 0.65, 1);
    rimLight.position.set(-2.5, 4.2, -4.5);
    scene.add(rimLight);

    // Soft warm studio floor shadow catcher
    const shadowGeo = new THREE.PlaneGeometry(18, 18);
    const shadowMat = new THREE.ShadowMaterial({ color: '#4a3520', opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.set(0, -1.32, 0);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const { bumpMap, roughnessMap } = createEngravingTextures();

    const goldMat = new THREE.MeshPhysicalMaterial({
      color: '#ffc124',
      metalness: 0.88,
      roughness: finish === 'matte' ? 0.24 : 0.1,
      roughnessMap,
      bumpMap,
      bumpScale: 0.018,
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

    const gemMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0.0,
      roughness: 0.02,
      transmission: 0.92,
      ior: 2.417,
      thickness: 0.6,
      envMapIntensity: 2.4,
      clearcoat: 1.0,
    });

    // Ring assembly standing upright at an elegant presentation angle
    const ringGroup = new THREE.Group();
    ringGroup.rotation.z = Math.PI / 2; // Orient ring vertically so crown sits at top (+Y)
    ringGroup.rotation.y = -0.25;
    ringGroup.position.y = 0.05;
    scene.add(ringGroup);

    // Rotate inner band so Lathe Y-axis becomes horizontal (ring stands upright)
    const bandGeo = createRingBandGeometry(1.04, 1.24, 0.42, 128);
    const bandMesh = new THREE.Mesh(bandGeo, goldMat);
    bandMesh.castShadow = true;
    bandMesh.receiveShadow = true;
    ringGroup.add(bandMesh);

    // Dual polished edge rails + milgrain micro-beads around both borders
    const railRadius = 1.225;
    const railGeo = new THREE.TorusGeometry(railRadius, 0.02, 16, 96);
    const topRail = new THREE.Mesh(railGeo, accentMat);
    topRail.rotation.x = Math.PI / 2;
    topRail.position.y = 0.175;
    topRail.castShadow = true;
    ringGroup.add(topRail);

    const bottomRail = new THREE.Mesh(railGeo, accentMat);
    bottomRail.rotation.x = Math.PI / 2;
    bottomRail.position.y = -0.175;
    bottomRail.castShadow = true;
    ringGroup.add(bottomRail);

    // Instanced milgrain beads along both rails
    const beadCount = 72;
    const beadGeo = new THREE.SphereGeometry(0.017, 10, 10);
    const beadMesh = new THREE.InstancedMesh(beadGeo, accentMat, beadCount * 2);
    beadMesh.castShadow = true;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < beadCount; i++) {
      const angle = (i / beadCount) * Math.PI * 2;
      const x = Math.cos(angle) * 1.242;
      const z = Math.sin(angle) * 1.242;

      dummy.position.set(x, 0.155, z);
      dummy.updateMatrix();
      beadMesh.setMatrixAt(i * 2, dummy.matrix);

      dummy.position.set(x, -0.155, z);
      dummy.updateMatrix();
      beadMesh.setMatrixAt(i * 2 + 1, dummy.matrix);
    }
    beadMesh.instanceMatrix.needsUpdate = true;
    ringGroup.add(beadMesh);

    // Gemstone crown positioned on the top outer ridge (local +X before Z rotation -> world +Y!)
    const crown = createGemstoneCrown(goldMat, accentMat, gemMat);
    crown.position.set(1.26, 0, 0);
    crown.rotation.z = -Math.PI / 2;
    ringGroup.add(crown);

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
      bandGeo.dispose();
      railGeo.dispose();
      beadGeo.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      bumpMap.dispose();
      roughnessMap.dispose();
      goldMat.dispose();
      accentMat.dispose();
      gemMat.dispose();
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
    cameraRef.current.position.set(2.5, 1.85, 4.35);
    controlsRef.current.target.set(0, 0.12, 0);
    controlsRef.current.update();
  };

  if (webglError) {
    return (
      <div className="necklace-3d-fallback">
        <img src="/images/collection/rings.webp" alt="Cincin emas 916" />
      </div>
    );
  }

  return (
    <div className="necklace-3d-wrap">
      <div
        ref={containerRef}
        className="necklace-3d-canvas"
        role="img"
        aria-label="Model 3D interaktif cincin emas 22K dengan ukiran halus dan putaran 360 darjah"
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

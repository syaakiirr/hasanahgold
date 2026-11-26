import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { GoldFinish } from './NecklaceViewer3D';

interface BangleViewer3DProps {
  finish?: GoldFinish;
}

function createKerawangTextures(): { bumpMap: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } {
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

  bCtx.fillStyle = '#c0c0c0';
  bCtx.fillRect(0, 0, width, height);
  rCtx.fillStyle = '#181818';
  rCtx.fillRect(0, 0, width, height);

  // Recessed central ornamental channel for traditional Malaysian kerawang stippling
  const top = height * 0.18;
  const bottom = height * 0.82;
  bCtx.fillStyle = '#8e8e8e';
  bCtx.fillRect(0, top, width, bottom - top);
  rCtx.fillStyle = '#525252';
  rCtx.fillRect(0, top, width, bottom - top);

  // Repeating songket / kerawang floral-diamond filigree engravings
  const repeats = 12;
  const step = width / repeats;
  for (let i = 0; i < repeats; i++) {
    const cx = (i + 0.5) * step;
    const cy = height * 0.5;

    // Diamond lattice frame
    bCtx.strokeStyle = '#e8e8e8';
    bCtx.lineWidth = 4;
    bCtx.beginPath();
    bCtx.moveTo(cx - step * 0.48, cy);
    bCtx.lineTo(cx, top + 8);
    bCtx.lineTo(cx + step * 0.48, cy);
    bCtx.lineTo(cx, bottom - 8);
    bCtx.closePath();
    bCtx.stroke();

    rCtx.strokeStyle = '#141414';
    rCtx.lineWidth = 4;
    rCtx.beginPath();
    rCtx.moveTo(cx - step * 0.48, cy);
    rCtx.lineTo(cx, top + 8);
    rCtx.lineTo(cx + step * 0.48, cy);
    rCtx.lineTo(cx, bottom - 8);
    rCtx.closePath();
    rCtx.stroke();

    // Fine scroll curves inside corners
    bCtx.strokeStyle = '#d4d4d4';
    bCtx.lineWidth = 2.2;
    bCtx.beginPath();
    bCtx.arc(cx - step * 0.34, top + 24, 14, 0, Math.PI * 1.4);
    bCtx.stroke();
    bCtx.beginPath();
    bCtx.arc(cx + step * 0.34, bottom - 24, 14, Math.PI, Math.PI * 2.4);
    bCtx.stroke();
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

function createBangleBodyGeometry(
  innerRadius = 1.32,
  outerRadius = 1.53,
  width = 0.56,
  radialSegments = 128
): THREE.BufferGeometry {
  const halfW = width / 2;
  const profile: THREE.Vector2[] = [];

  // Smooth comfort-fit inner surface
  const innerSteps = 12;
  for (let i = 0; i <= innerSteps; i++) {
    const t = i / innerSteps;
    const y = -halfW * 0.92 + t * (halfW * 1.84);
    const bulge = Math.sin(t * Math.PI) * 0.022;
    profile.push(new THREE.Vector2(innerRadius + bulge, y));
  }

  // Polished top rim shoulder
  profile.push(new THREE.Vector2(innerRadius + 0.03, halfW));
  profile.push(new THREE.Vector2(outerRadius - 0.03, halfW));

  // Gently domed outer ornamental surface
  const outerSteps = 18;
  for (let i = 0; i <= outerSteps; i++) {
    const t = i / outerSteps;
    const y = halfW * 0.93 - t * (halfW * 1.86);
    const dome = Math.sin(t * Math.PI) * 0.036;
    profile.push(new THREE.Vector2(outerRadius + dome, y));
  }

  // Polished bottom rim shoulder back to start
  profile.push(new THREE.Vector2(outerRadius - 0.03, -halfW));
  profile.push(new THREE.Vector2(innerRadius + 0.03, -halfW));
  profile.push(profile[0].clone());

  const geo = new THREE.LatheGeometry(profile, radialSegments);
  geo.computeVertexNormals();
  return geo;
}

export default function BangleViewer3D({ finish = '916' }: BangleViewer3DProps) {
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
    camera.position.set(2.4, 2.15, 4.95);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 3.0;
    controls.maxDistance = 9.5;
    controls.target.set(0, 0.0, 0);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.7;
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
    shadowPlane.position.set(0, -1.15, 0);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const { bumpMap, roughnessMap } = createKerawangTextures();

    const goldMat = new THREE.MeshPhysicalMaterial({
      color: '#ffc124',
      metalness: 0.88,
      roughness: finish === 'matte' ? 0.24 : 0.1,
      roughnessMap,
      bumpMap,
      bumpScale: 0.022,
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

    const bangleGroup = new THREE.Group();
    bangleGroup.rotation.x = 0.32;
    bangleGroup.rotation.z = -0.14;
    scene.add(bangleGroup);

    const bodyGeo = createBangleBodyGeometry(1.32, 1.53, 0.56, 128);
    const bodyMesh = new THREE.Mesh(bodyGeo, goldMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bangleGroup.add(bodyMesh);

    // Mirror-polished raised border rims
    const rimGeo = new THREE.TorusGeometry(1.525, 0.026, 16, 120);
    const topRim = new THREE.Mesh(rimGeo, accentMat);
    topRim.rotation.x = Math.PI / 2;
    topRim.position.y = 0.245;
    topRim.castShadow = true;
    bangleGroup.add(topRim);

    const bottomRim = new THREE.Mesh(rimGeo, accentMat);
    bottomRim.rotation.x = Math.PI / 2;
    bottomRim.position.y = -0.245;
    bottomRim.castShadow = true;
    bangleGroup.add(bottomRim);

    // Dual-row milgrain border beads (96 per rim)
    const beadCount = 96;
    const beadGeo = new THREE.SphereGeometry(0.016, 10, 10);
    const beadMesh = new THREE.InstancedMesh(beadGeo, accentMat, beadCount * 2);
    beadMesh.castShadow = true;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < beadCount; i++) {
      const angle = (i / beadCount) * Math.PI * 2;
      const x = Math.cos(angle) * 1.545;
      const z = Math.sin(angle) * 1.545;

      dummy.position.set(x, 0.215, z);
      dummy.updateMatrix();
      beadMesh.setMatrixAt(i * 2, dummy.matrix);

      dummy.position.set(x, -0.215, z);
      dummy.updateMatrix();
      beadMesh.setMatrixAt(i * 2 + 1, dummy.matrix);
    }
    beadMesh.instanceMatrix.needsUpdate = true;
    bangleGroup.add(beadMesh);

    // Actual 3D sculpted Malaysian floral rosettes & diamond ribs around the bangle
    const motifCount = 12;
    const petalsPerFlower = 8;
    const petalGeo = new THREE.SphereGeometry(0.042, 12, 12);
    petalGeo.scale(1.65, 0.72, 0.42);
    const centerGeo = new THREE.SphereGeometry(0.036, 14, 14);
    centerGeo.scale(1, 1, 0.65);

    const petalMesh = new THREE.InstancedMesh(petalGeo, accentMat, motifCount * petalsPerFlower);
    const centerMesh = new THREE.InstancedMesh(centerGeo, goldMat, motifCount);
    petalMesh.castShadow = true;
    centerMesh.castShadow = true;

    const outerR = 1.568;
    const radialNormal = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const basis = new THREE.Matrix4();
    const petalRot = new THREE.Quaternion();
    let petalIdx = 0;

    for (let m = 0; m < motifCount; m++) {
      const angle = (m / motifCount) * Math.PI * 2;
      const cx = Math.cos(angle) * outerR;
      const cz = Math.sin(angle) * outerR;

      radialNormal.set(Math.cos(angle), 0, Math.sin(angle)).normalize();
      tangent.set(-Math.sin(angle), 0, Math.cos(angle)).normalize();
      basis.makeBasis(tangent, up, radialNormal);

      // Flower center stamen
      dummy.position.set(cx, 0, cz);
      dummy.quaternion.setFromRotationMatrix(basis);
      dummy.updateMatrix();
      centerMesh.setMatrixAt(m, dummy.matrix);

      // 8 sculpted petals radiating around each floral center
      for (let p = 0; p < petalsPerFlower; p++) {
        const pAngle = (p / petalsPerFlower) * Math.PI * 2;
        const offsetT = Math.cos(pAngle) * 0.088;
        const offsetY = Math.sin(pAngle) * 0.088;

        dummy.position
          .set(cx, offsetY, cz)
          .addScaledVector(tangent, offsetT);

        dummy.quaternion.setFromRotationMatrix(basis);
        petalRot.setFromAxisAngle(radialNormal, pAngle);
        dummy.quaternion.premultiply(petalRot);
        dummy.updateMatrix();
        petalMesh.setMatrixAt(petalIdx++, dummy.matrix);
      }
    }
    petalMesh.instanceMatrix.needsUpdate = true;
    centerMesh.instanceMatrix.needsUpdate = true;
    bangleGroup.add(petalMesh);
    bangleGroup.add(centerMesh);

    // Subtle hinged safety catch detail on one side
    const catchLoopGeo = new THREE.TorusGeometry(0.048, 0.015, 12, 24);
    const catchLoop = new THREE.Mesh(catchLoopGeo, accentMat);
    catchLoop.position.set(0, 0, 1.565);
    catchLoop.rotation.y = Math.PI / 2;
    catchLoop.castShadow = true;
    bangleGroup.add(catchLoop);

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
      bodyGeo.dispose();
      rimGeo.dispose();
      beadGeo.dispose();
      petalGeo.dispose();
      centerGeo.dispose();
      catchLoopGeo.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      bumpMap.dispose();
      roughnessMap.dispose();
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
    cameraRef.current.position.set(2.4, 2.15, 4.95);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  if (webglError) {
    return (
      <div className="necklace-3d-fallback">
        <img src="/images/collection/bangles.webp" alt="Bangle emas 916" />
      </div>
    );
  }

  return (
    <div className="necklace-3d-wrap">
      <div
        ref={containerRef}
        className="necklace-3d-canvas"
        role="img"
        aria-label="Model 3D interaktif bangle emas 22K berukir bunga dengan putaran 360 darjah"
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

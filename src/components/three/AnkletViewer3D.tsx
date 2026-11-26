import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { GoldFinish } from './NecklaceViewer3D';

interface AnkletViewer3DProps {
  finish?: GoldFinish;
}

function createAnkletCurve(): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = [];
  const segments = 28;
  const rx = 1.52;
  const rz = 1.38;
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const x = Math.cos(t) * rx;
    const z = Math.sin(t) * rz;
    const y = Math.sin(t * 3) * 0.025 + Math.cos(t) * 0.02;
    points.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
}

function createFineLinkGeometry(
  halfLen = 0.088,
  halfWidth = 0.048,
  wireRadius = 0.017
): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = [];
  const steps = 32;
  for (let i = 0; i < steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const x = Math.sign(cos) * Math.pow(Math.abs(cos), 0.82) * halfLen;
    const y = Math.sign(sin) * Math.pow(Math.abs(sin), 0.9) * halfWidth;
    pts.push(new THREE.Vector3(x, y, 0));
  }
  const path = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
  return new THREE.TubeGeometry(path, 36, wireRadius, 14, true);
}

function createTeardropCharmGeometry(): THREE.BufferGeometry {
  // Smooth 3D teardrop charm via LatheGeometry
  const profile: THREE.Vector2[] = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.052, 0.025),
    new THREE.Vector2(0.068, 0.065),
    new THREE.Vector2(0.056, 0.115),
    new THREE.Vector2(0.028, 0.165),
    new THREE.Vector2(0.012, 0.195),
    new THREE.Vector2(0.0, 0.205),
  ];
  const geo = new THREE.LatheGeometry(profile, 24);
  geo.computeVertexNormals();
  return geo;
}

function createClaspAndExtension(
  goldMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial,
  fineLinkGeo: THREE.BufferGeometry
): THREE.Group {
  const group = new THREE.Group();

  // Spring-ring clasp on left side
  const springRingGeo = new THREE.TorusGeometry(0.072, 0.017, 14, 32);
  const springRing = new THREE.Mesh(springRingGeo, goldMat);
  springRing.position.set(-0.075, 0, 0);
  springRing.rotation.x = Math.PI / 2;
  springRing.castShadow = true;
  group.add(springRing);

  // Tiny spring trigger tab
  const tabGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.042, 10);
  const tab = new THREE.Mesh(tabGeo, accentMat);
  tab.position.set(-0.075, 0.02, 0.078);
  tab.rotation.x = Math.PI / 2;
  group.add(tab);

  // Catch jump ring on right side
  const jumpGeo = new THREE.TorusGeometry(0.046, 0.013, 12, 24);
  const catchRing = new THREE.Mesh(jumpGeo, accentMat);
  catchRing.position.set(0.05, 0, 0);
  catchRing.castShadow = true;
  group.add(catchRing);

  // Delicate extension chain tail (7 small links draping outward)
  const extCount = 7;
  for (let i = 0; i < extCount; i++) {
    const link = new THREE.Mesh(fineLinkGeo, i % 2 === 0 ? goldMat : accentMat);
    link.scale.set(0.85, 0.85, 0.85);
    const t = i / extCount;
    link.position.set(0.11 + i * 0.078, -t * 0.06, -t * 0.22 - Math.sin(t * Math.PI) * 0.08);
    link.rotation.y = -0.55;
    link.rotation.x = i % 2 === 0 ? 0.15 : Math.PI / 2;
    link.castShadow = true;
    group.add(link);
  }

  // Signature tiny gold bead at the end of the extension chain
  const endBeadGeo = new THREE.SphereGeometry(0.042, 16, 16);
  const endBead = new THREE.Mesh(endBeadGeo, accentMat);
  endBead.position.set(0.11 + extCount * 0.078, -0.068, -0.25);
  endBead.castShadow = true;
  group.add(endBead);

  return group;
}

export default function AnkletViewer3D({ finish = '916' }: AnkletViewer3DProps) {
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
    camera.position.set(1.85, 2.35, 4.75);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.8;
    controls.maxDistance = 9.0;
    controls.target.set(0, 0, 0.05);
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
    shadowPlane.position.set(0, -0.58, 0);
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

    const ankletGroup = new THREE.Group();
    ankletGroup.rotation.x = 0.18;
    scene.add(ankletGroup);

    const curve = createAnkletCurve();
    const totalLength = curve.getLength();
    const linkPitch = 0.086;
    const linkCount = Math.floor(totalLength / linkPitch);

    const fineLinkGeo = createFineLinkGeometry();
    const charmGeo = createTeardropCharmGeometry();
    const charmRingGeo = new THREE.TorusGeometry(0.032, 0.009, 10, 20);
    const stationBeadGeo = new THREE.SphereGeometry(0.028, 12, 12);

    const evenIndices: number[] = [];
    const oddIndices: number[] = [];

    // Reserve gap at back (u = 0.75, -Z) for spring-ring clasp & extension chain
    const claspU = 0.75;
    const claspHalfGap = 0.025;
    for (let i = 0; i < linkCount; i++) {
      const u = i / linkCount;
      if (Math.abs(u - claspU) < claspHalfGap) continue;
      if (i % 2 === 0) evenIndices.push(i);
      else oddIndices.push(i);
    }

    const evenMesh = new THREE.InstancedMesh(fineLinkGeo, goldMat, evenIndices.length);
    const oddMesh = new THREE.InstancedMesh(fineLinkGeo, accentMat, oddIndices.length);
    evenMesh.castShadow = true;
    evenMesh.receiveShadow = true;
    oddMesh.castShadow = true;
    oddMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    const tangent = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const binormal = new THREE.Vector3();
    const upRef = new THREE.Vector3(0, 1, 0);
    const basisMatrix = new THREE.Matrix4();
    const rollQuat = new THREE.Quaternion();

    const placeLink = (
      linkIdx: number,
      mesh: THREE.InstancedMesh,
      instanceIdx: number,
      isOdd: boolean
    ) => {
      const u = linkIdx / linkCount;
      const pos = curve.getPointAt(u);
      curve.getTangentAt(u, tangent).normalize();

      binormal.crossVectors(tangent, upRef).normalize();
      normal.crossVectors(binormal, tangent).normalize();

      basisMatrix.makeBasis(tangent, normal, binormal);
      dummy.position.copy(pos);
      dummy.quaternion.setFromRotationMatrix(basisMatrix);

      const twistAngle = isOdd ? Math.PI * 0.48 : 0.14;
      rollQuat.setFromAxisAngle(tangent, twistAngle);
      dummy.quaternion.premultiply(rollQuat);

      dummy.updateMatrix();
      mesh.setMatrixAt(instanceIdx, dummy.matrix);
    };

    evenIndices.forEach((linkIdx, idx) => placeLink(linkIdx, evenMesh, idx, false));
    oddIndices.forEach((linkIdx, idx) => placeLink(linkIdx, oddMesh, idx, true));
    evenMesh.instanceMatrix.needsUpdate = true;
    oddMesh.instanceMatrix.needsUpdate = true;

    ankletGroup.add(evenMesh);
    ankletGroup.add(oddMesh);

    // 5 delicate dangling teardrop charms along the front arc (u around 0.25 = +Z)
    const charmUs = [0.05, 0.15, 0.25, 0.35, 0.45];
    charmUs.forEach((u) => {
      const pos = curve.getPointAt(u);
      const tan = curve.getTangentAt(u).normalize();
      const outDir = new THREE.Vector3().crossVectors(tan, upRef).normalize();

      const charmAnchor = new THREE.Group();
      charmAnchor.position.copy(pos).addScaledVector(outDir, 0.045);

      const ring = new THREE.Mesh(charmRingGeo, accentMat);
      ring.rotation.y = Math.atan2(outDir.x, outDir.z);
      charmAnchor.add(ring);

      const drop = new THREE.Mesh(charmGeo, goldMat);
      drop.position.set(outDir.x * 0.03, -0.22, outDir.z * 0.03);
      drop.rotation.x = outDir.z * 0.35;
      drop.rotation.z = -outDir.x * 0.35;
      drop.castShadow = true;
      charmAnchor.add(drop);

      ankletGroup.add(charmAnchor);
    });

    // Subtle gold bead stations between charms
    const stationUs = [0.1, 0.2, 0.3, 0.4];
    stationUs.forEach((u) => {
      const pos = curve.getPointAt(u);
      const bead = new THREE.Mesh(stationBeadGeo, accentMat);
      bead.position.copy(pos);
      bead.castShadow = true;
      ankletGroup.add(bead);
    });

    // Clasp & extension chain assembly at back (u = 0.75)
    const claspAssembly = createClaspAndExtension(goldMat, accentMat, fineLinkGeo);
    const claspPos = curve.getPointAt(claspU);
    const claspTan = curve.getTangentAt(claspU).normalize();
    const claspBin = new THREE.Vector3().crossVectors(claspTan, upRef).normalize();
    const claspNorm = new THREE.Vector3().crossVectors(claspBin, claspTan).normalize();
    const claspBasis = new THREE.Matrix4().makeBasis(claspTan, claspNorm, claspBin);
    claspAssembly.position.copy(claspPos);
    claspAssembly.quaternion.setFromRotationMatrix(claspBasis);
    ankletGroup.add(claspAssembly);

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
      fineLinkGeo.dispose();
      charmGeo.dispose();
      charmRingGeo.dispose();
      stationBeadGeo.dispose();
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
    cameraRef.current.position.set(1.85, 2.35, 4.75);
    controlsRef.current.target.set(0, 0, 0.05);
    controlsRef.current.update();
  };

  if (webglError) {
    return (
      <div className="necklace-3d-fallback">
        <img src="/images/collection/anklets.webp" alt="Gelang kaki emas 916" />
      </div>
    );
  }

  return (
    <div className="necklace-3d-wrap">
      <div
        ref={containerRef}
        className="necklace-3d-canvas"
        role="img"
        aria-label="Model 3D interaktif gelang kaki emas 22K berhias titisan dengan putaran 360 darjah"
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

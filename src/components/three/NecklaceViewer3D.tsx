import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type GoldFinish = '916' | 'two-tone' | 'matte';

interface NecklaceViewer3DProps {
  finish?: GoldFinish;
}

function createOvalLinkGeometry(
  halfLength: number,
  halfWidth: number,
  wireRadius: number,
  tubularSegments = 48,
  radialSegments = 18
): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const steps = 40;
  for (let i = 0; i < steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    // Superellipse / stadium-like smooth oval for realistic gold cable-oval link
    const signX = Math.sign(cos);
    const signY = Math.sign(sin);
    const x = signX * Math.pow(Math.abs(cos), 0.82) * halfLength;
    const y = signY * Math.pow(Math.abs(sin), 0.92) * halfWidth;
    points.push(new THREE.Vector3(x, y, 0));
  }
  const path = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
  return new THREE.TubeGeometry(path, tubularSegments, wireRadius, radialSegments, true);
}

function createNecklaceCurve(): THREE.CatmullRomCurve3 {
  // Natural draped catenary loop: narrow at clasp (top +Y), sweeping gracefully forward & down (-Y, +Z)
  const rawPoints = [
    new THREE.Vector3(0.0, 2.35, -0.55),   // Clasp top center
    new THREE.Vector3(0.55, 2.25, -0.45),
    new THREE.Vector3(1.12, 1.92, -0.22),
    new THREE.Vector3(1.52, 1.32, 0.08),
    new THREE.Vector3(1.66, 0.55, 0.34),
    new THREE.Vector3(1.52, -0.32, 0.52),
    new THREE.Vector3(1.14, -1.16, 0.62),
    new THREE.Vector3(0.60, -1.78, 0.66),
    new THREE.Vector3(0.0, -2.02, 0.67),   // Lowest catenary drape center
    new THREE.Vector3(-0.60, -1.78, 0.66),
    new THREE.Vector3(-1.14, -1.16, 0.62),
    new THREE.Vector3(-1.52, -0.32, 0.52),
    new THREE.Vector3(-1.66, 0.55, 0.34),
    new THREE.Vector3(-1.52, 1.32, 0.08),
    new THREE.Vector3(-1.12, 1.92, -0.22),
    new THREE.Vector3(-0.55, 2.25, -0.45),
  ];
  return new THREE.CatmullRomCurve3(rawPoints, true, 'catmullrom', 0.5);
}

function createClaspAssembly(
  goldMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial
): THREE.Group {
  const claspGroup = new THREE.Group();

  // Left & right end-cap collars connecting chain to jump rings
  const collarGeo = new THREE.CylinderGeometry(0.044, 0.038, 0.14, 20);
  const collarRingGeo = new THREE.TorusGeometry(0.044, 0.011, 12, 24);

  const leftCollar = new THREE.Mesh(collarGeo, accentMat);
  leftCollar.position.set(-0.26, 0, 0);
  leftCollar.rotation.z = Math.PI / 2;
  leftCollar.castShadow = true;
  claspGroup.add(leftCollar);

  const leftCollarLip = new THREE.Mesh(collarRingGeo, accentMat);
  leftCollarLip.position.set(-0.20, 0, 0);
  leftCollarLip.rotation.y = Math.PI / 2;
  claspGroup.add(leftCollarLip);

  const rightCollar = new THREE.Mesh(collarGeo, accentMat);
  rightCollar.position.set(0.26, 0, 0);
  rightCollar.rotation.z = Math.PI / 2;
  rightCollar.castShadow = true;
  claspGroup.add(rightCollar);

  const rightCollarLip = new THREE.Mesh(collarRingGeo, accentMat);
  rightCollarLip.position.set(0.20, 0, 0);
  rightCollarLip.rotation.y = Math.PI / 2;
  claspGroup.add(rightCollarLip);

  // Jump rings on both sides
  const jumpRingGeo = new THREE.TorusGeometry(0.068, 0.018, 14, 32);
  const leftJump = new THREE.Mesh(jumpRingGeo, goldMat);
  leftJump.position.set(-0.15, 0, 0);
  leftJump.rotation.x = Math.PI / 2;
  leftJump.castShadow = true;
  claspGroup.add(leftJump);

  const rightJump = new THREE.Mesh(jumpRingGeo, accentMat);
  rightJump.position.set(0.14, 0, 0);
  rightJump.castShadow = true;
  claspGroup.add(rightJump);

  // Lobster clasp curved hook body
  const hookPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.10, -0.01, 0),
    new THREE.Vector3(-0.04, 0.065, 0),
    new THREE.Vector3(0.06, 0.085, 0),
    new THREE.Vector3(0.13, 0.045, 0),
    new THREE.Vector3(0.135, -0.025, 0),
    new THREE.Vector3(0.085, -0.055, 0),
  ]);
  const hookGeo = new THREE.TubeGeometry(hookPath, 36, 0.026, 16, false);
  const hookMesh = new THREE.Mesh(hookGeo, goldMat);
  hookMesh.castShadow = true;
  claspGroup.add(hookMesh);

  // Rounded tip cap on hook end
  const tipGeo = new THREE.SphereGeometry(0.026, 16, 16);
  const tipMesh = new THREE.Mesh(tipGeo, goldMat);
  tipMesh.position.set(0.085, -0.055, 0);
  claspGroup.add(tipMesh);

  // Hinge barrel + spring gate bar
  const barrelGeo = new THREE.CylinderGeometry(0.034, 0.034, 0.075, 18);
  const barrelMesh = new THREE.Mesh(barrelGeo, goldMat);
  barrelMesh.position.set(-0.09, -0.02, 0);
  barrelMesh.rotation.x = Math.PI / 2;
  claspGroup.add(barrelMesh);

  const gateGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.14, 12);
  const gateMesh = new THREE.Mesh(gateGeo, accentMat);
  gateMesh.position.set(-0.005, -0.042, 0);
  gateMesh.rotation.z = Math.PI / 2.2;
  claspGroup.add(gateMesh);

  // Articulated thumb trigger lever
  const leverPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.05, -0.03, 0),
    new THREE.Vector3(-0.065, -0.095, 0),
    new THREE.Vector3(-0.095, -0.115, 0),
  ]);
  const leverGeo = new THREE.TubeGeometry(leverPath, 14, 0.015, 12, false);
  const leverMesh = new THREE.Mesh(leverGeo, accentMat);
  claspGroup.add(leverMesh);

  const leverKnob = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), accentMat);
  leverKnob.position.set(-0.095, -0.115, 0);
  claspGroup.add(leverKnob);

  // Small 916 hallmark oval tag hanging beside the catch ring
  const tagGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.014, 24);
  const tagMesh = new THREE.Mesh(tagGeo, goldMat);
  tagMesh.scale.set(1.35, 1, 0.85);
  tagMesh.position.set(0.18, -0.085, 0.015);
  tagMesh.rotation.set(0.35, 0.2, -0.35);
  tagMesh.castShadow = true;
  claspGroup.add(tagMesh);

  return claspGroup;
}

export default function NecklaceViewer3D({ finish = '916' }: NecklaceViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const goldMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const accentMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const [webglError, setWebglError] = useState(false);

  // Update materials dynamically when Kemasan swatch changes
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

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
    camera.position.set(0, 0.45, 7.3);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 3.8;
    controls.maxDistance = 12.0;
    controls.target.set(0, 0.1, 0.1);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.65;
    controlsRef.current = controls;

    const pauseAutoRotate = () => {
      controls.autoRotate = false;
    };
    controls.addEventListener('start', pauseAutoRotate);

    // Bright, warm golden studio lighting rig
    const ambient = new THREE.AmbientLight('#ffc43d', 0.45);
    scene.add(ambient);

    const hemiLight = new THREE.HemisphereLight('#fff2c6', '#c78c24', 1.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#ffebb3', 2.8);
    keyLight.position.set(4.5, 6.5, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#ffdf8c', 1.45);
    fillLight.position.set(-5.0, 2.5, 4.5);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight('#ffd05b', 6.0, 18, Math.PI / 4, 0.65, 1);
    rimLight.position.set(-2.5, 4.5, -5.0);
    scene.add(rimLight);

    // Warm soft shadow catcher on the cream studio floor
    const backdropGeo = new THREE.PlaneGeometry(24, 24);
    const backdropMat = new THREE.ShadowMaterial({ color: '#4a3520', opacity: 0.16 });
    const shadowPlane = new THREE.Mesh(backdropGeo, backdropMat);
    shadowPlane.position.set(0, -2.45, 0);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Radiant 22K Yellow Gold Material
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

    // Necklace Root Group (tilted slightly like luxury studio bust photography)
    const necklaceGroup = new THREE.Group();
    necklaceGroup.rotation.x = -0.18;
    scene.add(necklaceGroup);

    const curve = createNecklaceCurve();
    const totalLength = curve.getLength();

    // Link dimensions: interlocking oval links
    const halfLen = 0.128;
    const halfWidth = 0.072;
    const wireRadius = 0.025;
    const linkPitch = 0.125; // Tighter than outer length (0.256) so links cleanly interlock
    const linkCount = Math.floor(totalLength / linkPitch);

    const linkGeo = createOvalLinkGeometry(halfLen, halfWidth, wireRadius);

    // Split links into even (primary gold) and odd (accent/interlocking) InstancedMeshes
    const evenIndices: number[] = [];
    const oddIndices: number[] = [];

    // Reserve a small gap around u = 0 / 1 for the lobster clasp assembly
    const claspGapRatio = 0.032;
    for (let i = 0; i < linkCount; i++) {
      const u = i / linkCount;
      if (u < claspGapRatio || u > 1 - claspGapRatio) continue;
      if (i % 2 === 0) evenIndices.push(i);
      else oddIndices.push(i);
    }

    const evenMesh = new THREE.InstancedMesh(linkGeo, goldMat, evenIndices.length);
    const oddMesh = new THREE.InstancedMesh(linkGeo, accentMat, oddIndices.length);
    evenMesh.castShadow = true;
    evenMesh.receiveShadow = true;
    oddMesh.castShadow = true;
    oddMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    const tangent = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const binormal = new THREE.Vector3();
    const upRef = new THREE.Vector3(0, 0, 1);
    const basisMatrix = new THREE.Matrix4();
    const rollQuat = new THREE.Quaternion();

    const placeLink = (i: number, mesh: THREE.InstancedMesh, instanceIdx: number, isOdd: boolean) => {
      const u = i / linkCount;
      const pos = curve.getPointAt(u);
      curve.getTangentAt(u, tangent).normalize();

      binormal.crossVectors(tangent, upRef).normalize();
      if (binormal.lengthSq() < 0.001) {
        binormal.set(1, 0, 0);
      }
      normal.crossVectors(binormal, tangent).normalize();

      // Local X along tangent, Y along normal, Z along binormal
      basisMatrix.makeBasis(tangent, normal, binormal);
      dummy.position.copy(pos);
      dummy.quaternion.setFromRotationMatrix(basisMatrix);

      // Rotate alternating links by ~82 deg around tangent so they physically interlock
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

    necklaceGroup.add(evenMesh);
    necklaceGroup.add(oddMesh);

    // Place detailed clasp assembly at the top gap (u = 0)
    const claspAssembly = createClaspAssembly(goldMat, accentMat);
    const claspPos = curve.getPointAt(0);
    const claspTangent = curve.getTangentAt(0).normalize();
    const claspBinormal = new THREE.Vector3().crossVectors(claspTangent, upRef).normalize();
    const claspNormal = new THREE.Vector3().crossVectors(claspBinormal, claspTangent).normalize();
    const claspBasis = new THREE.Matrix4().makeBasis(claspTangent, claspNormal, claspBinormal);
    claspAssembly.position.copy(claspPos);
    claspAssembly.quaternion.setFromRotationMatrix(claspBasis);
    necklaceGroup.add(claspAssembly);

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
      linkGeo.dispose();
      backdropGeo.dispose();
      backdropMat.dispose();
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
    cameraRef.current.position.set(0, 0.45, 7.3);
    controlsRef.current.target.set(0, 0.1, 0.1);
    controlsRef.current.update();
  };

  if (webglError) {
    return (
      <div className="necklace-3d-fallback">
        <img src="/images/collection/necklaces.webp" alt="Rantai leher emas 916" />
      </div>
    );
  }

  return (
    <div className="necklace-3d-wrap">
      <div
        ref={containerRef}
        className="necklace-3d-canvas"
        role="img"
        aria-label="Model 3D interaktif rantai leher emas 22K dengan putaran 360 darjah"
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

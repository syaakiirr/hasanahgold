import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { GoldFinish } from './NecklaceViewer3D';

interface BraceletViewer3DProps {
  finish?: GoldFinish;
}

function createBraceletCurve(): THREE.CatmullRomCurve3 {
  // Natural wrist-oval contour with subtle organic rest undulation
  const points: THREE.Vector3[] = [];
  const segments = 24;
  const rx = 1.62;
  const rz = 1.24;
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const x = Math.cos(t) * rx;
    const z = Math.sin(t) * rz;
    const y = Math.sin(t * 2) * 0.045;
    points.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
}

function createDecorativeLinkGeometry(): THREE.BufferGeometry {
  // Sculpted stadium/oval link for a substantial 916 gold bracelet
  const halfLen = 0.21;
  const halfWidth = 0.125;
  const wireRadius = 0.044;
  const pts: THREE.Vector3[] = [];
  const steps = 40;
  for (let i = 0; i < steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const x = Math.sign(cos) * Math.pow(Math.abs(cos), 0.78) * halfLen;
    const y = Math.sign(sin) * Math.pow(Math.abs(sin), 0.88) * halfWidth;
    pts.push(new THREE.Vector3(x, y, 0));
  }
  const path = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
  return new THREE.TubeGeometry(path, 48, wireRadius, 18, true);
}

function createBoxClaspAssembly(
  goldMat: THREE.MeshPhysicalMaterial,
  accentMat: THREE.MeshPhysicalMaterial
): THREE.Group {
  const clasp = new THREE.Group();

  // Main chamfered box clasp housing
  const bodyGeo = new THREE.BoxGeometry(0.46, 0.16, 0.28);
  const body = new THREE.Mesh(bodyGeo, goldMat);
  body.castShadow = true;
  body.receiveShadow = true;
  clasp.add(body);

  // Ornamental beveled top plate with recessed border frame
  const topPlateGeo = new THREE.BoxGeometry(0.38, 0.03, 0.21);
  const topPlate = new THREE.Mesh(topPlateGeo, accentMat);
  topPlate.position.y = 0.088;
  topPlate.castShadow = true;
  clasp.add(topPlate);

  // Decorative center ridge / hallmark bar on top plate
  const barGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.28, 14);
  const bar = new THREE.Mesh(barGeo, goldMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.y = 0.105;
  clasp.add(bar);

  // End connection collars + hinge pins
  const collarGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.08, 18);
  const leftCollar = new THREE.Mesh(collarGeo, accentMat);
  leftCollar.rotation.z = Math.PI / 2;
  leftCollar.position.set(-0.25, 0, 0);
  leftCollar.castShadow = true;
  clasp.add(leftCollar);

  const rightCollar = new THREE.Mesh(collarGeo, accentMat);
  rightCollar.rotation.z = Math.PI / 2;
  rightCollar.position.set(0.25, 0, 0);
  rightCollar.castShadow = true;
  clasp.add(rightCollar);

  // Push-button release tab on the side
  const buttonGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.06, 16);
  const pushBtn = new THREE.Mesh(buttonGeo, accentMat);
  pushBtn.rotation.x = Math.PI / 2;
  pushBtn.position.set(0.08, 0.01, 0.155);
  pushBtn.castShadow = true;
  clasp.add(pushBtn);

  // Figure-8 safety catch latch on the opposite side
  const loopGeo = new THREE.TorusGeometry(0.042, 0.014, 12, 24);
  const latchUpper = new THREE.Mesh(loopGeo, accentMat);
  latchUpper.position.set(-0.08, 0.02, -0.155);
  latchUpper.rotation.x = 0.15;
  clasp.add(latchUpper);

  const latchLower = new THREE.Mesh(loopGeo, accentMat);
  latchLower.position.set(-0.14, 0.02, -0.155);
  latchLower.rotation.x = 0.15;
  clasp.add(latchLower);

  const pinGeo = new THREE.SphereGeometry(0.022, 12, 12);
  const latchPin = new THREE.Mesh(pinGeo, goldMat);
  latchPin.position.set(-0.16, 0.02, -0.165);
  clasp.add(latchPin);

  return clasp;
}

export default function BraceletViewer3D({ finish = '916' }: BraceletViewer3DProps) {
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
    camera.position.set(2.4, 2.55, 4.9);
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

    // Warm studio floor shadow catcher
    const shadowGeo = new THREE.PlaneGeometry(20, 20);
    const shadowMat = new THREE.ShadowMaterial({ color: '#4a3520', opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.set(0, -0.42, 0);
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

    const braceletGroup = new THREE.Group();
    braceletGroup.rotation.x = 0.22;
    scene.add(braceletGroup);

    const curve = createBraceletCurve();
    const totalLength = curve.getLength();
    const linkPitch = 0.205;
    const linkCount = Math.floor(totalLength / linkPitch);

    const linkGeo = createDecorativeLinkGeometry();
    const jointGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.175, 14);
    const beadGeo = new THREE.SphereGeometry(0.032, 12, 12);

    const evenIndices: number[] = [];
    const oddIndices: number[] = [];

    // Reserve space around u = 0.25 (front +Z) for the detailed box clasp
    const claspU = 0.25;
    const claspHalfGap = 0.042;
    for (let i = 0; i < linkCount; i++) {
      const u = i / linkCount;
      if (Math.abs(u - claspU) < claspHalfGap) continue;
      if (i % 2 === 0) evenIndices.push(i);
      else oddIndices.push(i);
    }

    const evenMesh = new THREE.InstancedMesh(linkGeo, goldMat, evenIndices.length);
    const oddMesh = new THREE.InstancedMesh(linkGeo, accentMat, oddIndices.length);
    const jointMesh = new THREE.InstancedMesh(jointGeo, accentMat, evenIndices.length + oddIndices.length);
    const beadMesh = new THREE.InstancedMesh(beadGeo, accentMat, evenIndices.length);

    evenMesh.castShadow = true;
    evenMesh.receiveShadow = true;
    oddMesh.castShadow = true;
    oddMesh.receiveShadow = true;
    jointMesh.castShadow = true;
    beadMesh.castShadow = true;

    const dummy = new THREE.Object3D();
    const tangent = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const binormal = new THREE.Vector3();
    const upRef = new THREE.Vector3(0, 1, 0);
    const basisMatrix = new THREE.Matrix4();
    const rollQuat = new THREE.Quaternion();
    let jointCounter = 0;

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

      // Interlock alternating links cleanly
      const twistAngle = isOdd ? Math.PI * 0.45 : 0.28;
      rollQuat.setFromAxisAngle(tangent, twistAngle);
      dummy.quaternion.premultiply(rollQuat);
      dummy.updateMatrix();
      mesh.setMatrixAt(instanceIdx, dummy.matrix);

      // Connection joint pin between adjacent links
      const jointU = (u + 0.5 / linkCount) % 1;
      const jointPos = curve.getPointAt(jointU);
      const jointTan = curve.getTangentAt(jointU).normalize();
      const jointBin = new THREE.Vector3().crossVectors(jointTan, upRef).normalize();
      const jointNorm = new THREE.Vector3().crossVectors(jointBin, jointTan).normalize();
      basisMatrix.makeBasis(jointTan, jointNorm, jointBin);
      dummy.position.copy(jointPos);
      dummy.quaternion.setFromRotationMatrix(basisMatrix);
      dummy.updateMatrix();
      jointMesh.setMatrixAt(jointCounter++, dummy.matrix);

      // Ornamental gold bead accent on outer face of even links
      if (!isOdd) {
        dummy.position.copy(pos).addScaledVector(binormal, 0.13);
        dummy.quaternion.identity();
        dummy.updateMatrix();
        beadMesh.setMatrixAt(instanceIdx, dummy.matrix);
      }
    };

    evenIndices.forEach((linkIdx, idx) => placeLink(linkIdx, evenMesh, idx, false));
    oddIndices.forEach((linkIdx, idx) => placeLink(linkIdx, oddMesh, idx, true));

    evenMesh.instanceMatrix.needsUpdate = true;
    oddMesh.instanceMatrix.needsUpdate = true;
    jointMesh.instanceMatrix.needsUpdate = true;
    beadMesh.instanceMatrix.needsUpdate = true;

    braceletGroup.add(evenMesh);
    braceletGroup.add(oddMesh);
    braceletGroup.add(jointMesh);
    braceletGroup.add(beadMesh);

    // Place box clasp & safety latch at front (+Z, u = 0.25)
    const claspAssembly = createBoxClaspAssembly(goldMat, accentMat);
    const claspPos = curve.getPointAt(claspU);
    const claspTan = curve.getTangentAt(claspU).normalize();
    const claspBin = new THREE.Vector3().crossVectors(claspTan, upRef).normalize();
    const claspNorm = new THREE.Vector3().crossVectors(claspBin, claspTan).normalize();
    const claspBasis = new THREE.Matrix4().makeBasis(claspTan, claspNorm, claspBin);
    claspAssembly.position.copy(claspPos);
    claspAssembly.quaternion.setFromRotationMatrix(claspBasis);
    braceletGroup.add(claspAssembly);

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
      jointGeo.dispose();
      beadGeo.dispose();
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
    cameraRef.current.position.set(2.4, 2.55, 4.9);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  if (webglError) {
    return (
      <div className="necklace-3d-fallback">
        <img src="/images/collection/bracelets.webp" alt="Gelang emas 916" />
      </div>
    );
  }

  return (
    <div className="necklace-3d-wrap">
      <div
        ref={containerRef}
        className="necklace-3d-canvas"
        role="img"
        aria-label="Model 3D interaktif gelang emas 22K dengan putaran 360 darjah"
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

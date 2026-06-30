import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';
import { useRef, useState } from 'react';
import type { Points as ThreePoints } from 'three';

function Particles() {
  const ref = useRef<ThreePoints>(null!);
  const [sphere] = useState(() => random.inSphere(new Float32Array(3000), { radius: 1.5 }) as Float32Array);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#a855f7" // Purple
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Particles />
      </Canvas>
    </div>
  );
}

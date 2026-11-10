import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function ThreeObby() {
  const [jump, setJump] = useState(false);
  const [keyState, setKeyState] = useState({ w: false, a: false, s: false, d: false, space: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeyState(prev => ({ ...prev, [e.code.toLowerCase()]: true }));
      if (e.code === 'Space') setJump(true);
    };
    const handleKeyUp = (e) => {
      setKeyState(prev => ({ ...prev, [e.code.toLowerCase()]: false }));
      if (e.code === 'Space') setJump(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const playerRef = useRef();

  useEffect(() => {
    let velocity = 0;
    const jumpForce = 8;
    const gravity = -0.1;
    let onGround = true;
    const moveSpeed = 5;

    const update = () => {
      let moveX = 0, moveZ = 0;
      if (keyState.w) moveZ -= moveSpeed;
      if (keyState.s) moveZ += moveSpeed;
      if (keyState.a) moveX -= moveSpeed;
      if (keyState.d) moveX += moveSpeed;

      playerRef.current.position.x += moveX * 0.1;
      playerRef.current.position.z += moveZ * 0.1;

      if (jump && onGround) {
        velocity = jumpForce;
        onGround = false;
      }

      velocity += gravity;
      playerRef.current.position.z += velocity * 0.1;

      if (playerRef.current.position.z < 2) {
        playerRef.current.position.z = 2;
        velocity = 0;
        onGround = true;
      }
    };

    const loop = () => {
      update();
      requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(loop);
  }, [jump, keyState]);

  return (
    <Canvas camera={{ position: [0, 10, 15], fov: 75 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls enableZoom={false} enablePan={false} />

      <mesh receiveShadow>
        <boxGeometry args={[200, 1, 200] } />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      <mesh position={[-5, 0, -5]} receiveShadow>
        <boxGeometry args={[10, 1, 10] } />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
      <mesh position={[15, 0, -10]} receiveShadow>
        <boxGeometry args={[10, 1, 10] } />
        <meshStandardMaterial color="#3498db" />
      </mesh>
      <mesh position={[25, 0, -5]} receiveShadow>
        <boxGeometry args={[10, 1, 10] } />
        <meshStandardMaterial color="#2ecc71" />
      </mesh>

      <mesh ref={playerRef} position={[0, 2, 0]} castShadow>
        <boxGeometry args={[2, 2, 2] } />
        <meshStandardMaterial color="#f1c40f" />
      </mesh>
    </Canvas>
  );
}
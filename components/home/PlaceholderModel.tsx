export default function PlaceholderModel() {
    return (
      <mesh scale={0.85}>
        <torusKnotGeometry args={[0.8, 0.28, 256, 64]} />
  
        <meshStandardMaterial
          color="#7c3aed"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>
    );
  }
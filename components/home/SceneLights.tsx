export default function SceneLights() {
    return (
      <>
        <ambientLight intensity={2} />
  
        <directionalLight
          position={[5, 5, 5]}
          intensity={3}
        />
  
        <pointLight
          position={[-5, 5, 2]}
          intensity={2}
          color="#7c3aed"
        />
      </>
    );
  }
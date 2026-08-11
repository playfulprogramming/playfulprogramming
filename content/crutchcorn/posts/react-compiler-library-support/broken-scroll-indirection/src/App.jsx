import { usePosition } from './useScroll';

function ShowScroll({ position }) {
  return (
    <p>
      {position.current.scrollY}
    </p>
  );
}

export default function ScrollPosition() {
  const position = usePosition();

  return <div style={{ position: 'fixed', top: '1rem', left: '1rem' }}>
    <ShowScroll position={position} />
    <p>
      {position.current.scrollY}
    </p>
  </div>;
}

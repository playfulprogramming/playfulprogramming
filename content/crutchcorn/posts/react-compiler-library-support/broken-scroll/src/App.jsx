import { usePosition } from './useScroll';

function ShowScroll({ position }) {
  // The React compiler is optimizing this to a memoized value, but because `usePosition`
  // doesn't follow the rules of React, it cannot know that `position` needs to be revalidated
  // on certain conditions. As such, it's perma-stuck on the first state (undefined) instead
  // of the updated state of the scroll position
  const scrollY = position.current.scrollY;

  return (
    <div>
      <p style={{ position: 'fixed', top: '1rem', left: '1rem' }}>
        {String(scrollY)}
      </p>

      <p style={{ position: 'fixed', top: '3rem', left: '1rem' }}>
        {position.current.scrollY}
      </p>
    </div>
  );
}

export default function ScrollPosition() {
  const position = usePosition();

  return <ShowScroll position={position} />;
}

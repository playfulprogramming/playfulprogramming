import {Suspense} from "react";

// Simulate an async data fetching function
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({name: "Corbin Crutchley"});
    }, 2000);
  });
}

// Race the passed promise against a timeout of 1 second
function race(promise) {
  return Promise.any([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(), 1000))
  ])
}

async function UserDisplay({promise}) {
  const user = await promise;
  return <div>{user.name}</div>;
}

export default async function Page() {
  // Start fetching user data
  const userPromise = fetchUser();

  // If the user data takes longer than 1 second, we will not wait for it
  // and instead render a fallback UI.
  await race(userPromise);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDisplay promise={userPromise} />
    </Suspense>
  );
}
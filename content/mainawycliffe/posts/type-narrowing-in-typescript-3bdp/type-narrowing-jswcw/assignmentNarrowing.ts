function acceptsNumber(z: number) {
  console.log(z);
}

const x: number | string = 1;

// despite type of x, being a union of number or string, this will not
// throw an error as typescript is clever to see the variable is currently
// assigned a number
acceptsNumber(x);

let y: number | string;

y = "Hello World"

// throws an error because y is now assigned a string and not a number
acceptsNumber(y);

// if we change the assignment to number, the error disappears
y = 2;
acceptsNumber(y);
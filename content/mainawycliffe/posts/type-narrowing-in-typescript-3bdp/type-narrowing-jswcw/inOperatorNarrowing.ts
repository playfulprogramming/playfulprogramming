type Circle = {
  radius: number;
};

type Reactangle = {
  width: number;
  height: number;
};

function calculateArea(shape: Circle | Reactangle) {
  if ("radius" in shape) {
    // now you can access radius from shape
    console.log("Area of circle: " + 3.14 * shape.radius * shape.radius);

    // any attempt to access height or width will result to an error
    shape.width; // Property 'width' does not exist on type 'Circle'.
    shape.height; // Error: Property 'height' does not exist on type 'Circle'
  }
  if ("width" in shape && "height" in shape) {
    // now you can access height and width from the shape object
    console.log("Area of reactangle: " + shape.height * shape.width);

    // any attempt to access raidus would result to an error
    shape.radius; // Error: Property 'radius' does not exist on type 'Reactangle'.ts
  }
}

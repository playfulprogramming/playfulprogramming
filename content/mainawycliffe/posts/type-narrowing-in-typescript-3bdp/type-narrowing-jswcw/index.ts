type Rectangle = {
    shape: "reactangle",
    width: number;
    height: number;
}

type Circle = {
    shape: "circle"
    radius: number;
}

function calculateArea(shape: Rectangle | Circle) { 
    if(shape.shape === "reactangle") {
        // you can only access the properties of reactangle and not circle
        console.log("Area of reactangle: " + shape.height * shape.width);

        // typescript would throw an error if you tried to access radius
        console.log(shape.radius);
    }

    if(shape.shape === "circle") {
        // you can only access the properties of circle and not reactangle
        console.log("Area of circle: " + 3.14 * shape.radius * shape.radius);

        // tupescript would throw an error if you tried to access width
        console.log(shape.width)
    }
}
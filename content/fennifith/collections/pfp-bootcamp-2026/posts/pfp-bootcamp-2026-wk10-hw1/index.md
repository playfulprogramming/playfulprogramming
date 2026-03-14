---
{
  title: "Week 10 - Tier 1 Homework",
  published: "2026-03-11T21:00:00.000Z",
  order: 12,
  noindex: true
}
---

# Building an eCommerce app

For this homework, you should start from a blank React template. Revisit the [week 7 homework](/posts/pfp-bootcamp-2026-wk7-hw1/) to create a new project (using `npm create vite@latest`).

## Creating a product list JSON file

Let's start by creating a `products.json` file in the `public/` folder. This file will provide a list of items in your shop.

```json
[
  {
    "id": "sunglasses",
    "name": "Cool Sunglasses",
    "description": "These sunglasses are very cool and totally worth your money.",
    "price": 200
  },
  {
    "id": "hat",
    "name": "Cool Hat",
    "description": "This hat is very cool and totally worth your money.",
    "price": 80
  },
  {
    "id": "rubber-ducky",
    "name": "Rubber Ducky",
    "description": "This rubber duck is very cool and totally worth your money.",
    "price": 1000
  }
]
```

Inside your app component, write a `fetch("/products.json")` call. Place it in a `useEffect`, and log the output to the console.

<details>
<summary>Hint</summary>

```js
useEffect(() => {
  fetch("/products.json")
    .then(response => response.json())
    .then(json => console.log(json));
}, []);
```

</details>

Open your app in the browser, and make sure you see the products logged in the console.

Next, let's make a `useState` to store the products array, and render the product names using `.map` into a `<p>` tag. Change the `useEffect` to store the products in your state instead of logging them to the console.

<details>
<summary>Hint</summary>

```jsx
function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/products.json")
      .then(response => response.json())
      .then(json => setProducts(json));
  }, []);

  return (
    <div>
      {products.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </div>
  );
}
```

</details>

You should now see the product names rendered in the browser!

## Creating a `<Product>` component

Next, let's create a new "Product" component to display the full product information.

Create a new `Product.jsx` file for our component, then write a Product function using `export default function Product() { ... }`.

Our Product component should:
- Accept a `product` property, using `props.product`
- Display the product name and description
- Display the price of the product
- Provide an "Add to Cart" button

Next, import your Product compnent from `App.jsx`. Replace the product name `<p>` tag with a `<Product key={product.id} product={product} />`.

You should see the list of products rendered in your browser!

## Adding a shopping cart

When someone presses the "Add to Cart" button, we want our app to store the product in the shopping cart.

Let's make a new `useState` in our App component to store the products in our cart.

```jsx
const [shoppingCart, setShoppingCart] = useState([]);
```

Next, let's implement the "Add to Cart" button. Write an `addProductToCart()` function within our App component. This function should accept one "product" argument and add it to the shoppingCart state.

```jsx
function addProductToCart(product) {
  console.log("Adding a product to the cart:", product.name);
  setShoppingCart([product, ...shoppingCart]);
}
```

Pass this function as a property into the `<Product>` component. Then, add an `onClick` callback to your button, which calls `props.addProductToCart(props.product)`.

<details>
<summary>Hint</summary>

```jsx
export default function Product(props) {
  function handleClick() {
    props.addProductToCart(props.product);
  }

  return (
    <div>
      <p>{props.product.name}</p>
      <p>{props.product.description}</p>
      <p>Price: ${props.product.price}</p>
      <button onClick={handleClick}>Add to Cart</button>
    </div>
  );
}
```

</details>

When you click the "Add to Cart" button, you should see our "Adding a product to the cart" log statement in the console.

## Displaying the shopping cart

Create a new `ShoppingCart.jsx` component, and pass it the `shoppingCart={shoppingCart}` property from our App.

This component should show the number and the total price of the products in our cart.

Write a `useMemo` hook to calculate the total price of the product in the cart.

<details>
<summary>Hint</summary>

```jsx
export default function ShoppingCart(props) {
  const totalPrice = useMemo(() => {
    let price = 0;
    props.shoppingCart.forEach((product) => {
      price += product.price;
    });
    return price;
  }, [props.shoppingCart]);

  return (
    <div>
      <p>You have {props.shoppingCart.length} products in your cart.</p>
      <p>Your bill is ${totalPrice}</p>
    </div>
  );
}
```

</details>

Also, let's use a [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) element to create a collapsible section within our page. This will contain a list of the products in our cart.

```jsx
<details>
  <summary>Shopping Cart</summary>
  {/* this is where we'll list the products that are in the cart */}
</details>
```

Use `props.shoppingCart.map` and use our `<Product>` component again to show each product in the cart.

> **Note:** In the shopping cart, we need to use "index" as the `key=` attribute instead of "product.id". This is because a product can appear multiple times in the cart.

<details>
<summary>Hint</summary>

```jsx
export default function ShoppingCart(props) {
  const totalPrice = useMemo(() => {
    let price = 0;
    props.shoppingCart.forEach((product) => {
      price += product.price;
    });
    return price;
  }, [props.shoppingCart]);

  return (
    <div>
      <p>You have {props.shoppingCart.length} products in your cart.</p>
      <p>Your bill is ${totalPrice}</p>
      <details>
        <summary>Shopping Cart</summary>
        {props.shoppingCart.map((product, index) => (
          <Product key={index} product={product} />
        ))}
      </details>
    </div>
  );
}
```

</details>

## Moving the shopping cart to Context

Our app should now be working! However, there's a small issue. The products shown in our shopping cart also have an "Add to Cart" button, but it doesn't do anything - because we aren't passing them the `addProductToCart` callback from our `App.jsx`.

To fix this, let's move our shopping cart into a [context](https://react.dev/reference/react/createContext).

Let's define a `ShoppingCartContext.js` file, which contains:

```js
export const ShoppingCartContext = createContext();
```

Then, in `App.jsx`, define a `const context = { shoppingCart, addProductToCart };` object.

Finally, wrap all of our JSX with `<ShoppingCartContext value={context}> ... </ShoppingCartContext>`.

This should provide our `shoppingCart` list and the `addProductToCart` callback to every component that needs it. We can access these values in `<Product>` with `const context = useContext(ShoppingCartContext);`.

Change the `onClick` behavior to use `addProductToCart` from our context instead of from the props.

Our "Add to Cart" button should now be working in the shopping cart as well as the product list!

<details>
<summary>Full Code</summary>

<iframe data-frame-title="Shopping App" src="pfp-code:./project?file=src/App.jsx"></iframe>

</details>

## Taking it further...

Now that we have an "Add to Cart" button, consider how we might implement a "Remove from Cart" button.

- The button should only appear on products that are in the `context.shoppingCart`
- You should define a `removeProductFromCart(product)` callback in our App.
- The callback should make a copy of the `shoppingCart` array, then remove the product from that array.
- Then, it should pass the new array `setShoppingCart()` to update the state.


import { useEffect, useState } from "react";
import "./App.css";
import Product from "./Product";
import ShoppingCart from "./ShoppingCart";
import { ShoppingCartContext } from "./ShoppingCartContext";

function App() {
  const [products, setProducts] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);

  useEffect(() => {
    fetch("/products.json")
      .then(response => response.json())
      .then(json => setProducts(json));
  }, []);

  function addProductToCart(product) {
    console.log("Adding a product to the cart:", product.name);
    setShoppingCart([product, ...shoppingCart]);
  }

  const context = { shoppingCart, addProductToCart };

  return (
    <ShoppingCartContext value={context}>
      <div className="app">
        <h1>My Cool Store</h1>
        <h2>Shopping Cart</h2>
        <div className="shopping-cart">
          <ShoppingCart shoppingCart={shoppingCart} />
        </div>
        <h2>Products for Sale</h2>
        <div className="products">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </ShoppingCartContext>
  );
}

export default App;

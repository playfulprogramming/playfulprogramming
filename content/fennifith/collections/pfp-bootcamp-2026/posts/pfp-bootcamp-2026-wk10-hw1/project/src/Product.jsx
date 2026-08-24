import { useContext } from "react";
import { ShoppingCartContext } from "./ShoppingCartContext";
import "./Product.css";

export default function Product(props) {
  const context = useContext(ShoppingCartContext);

  function handleClick() {
    context.addProductToCart(props.product);
  }

  return (
    <div className="product">
      <p>{props.product.name}</p>
      <p>{props.product.description}</p>
      <p className="product-price">Price: ${props.product.price}</p>
      <button onClick={handleClick}>Add to Cart</button>
    </div>
  );
}

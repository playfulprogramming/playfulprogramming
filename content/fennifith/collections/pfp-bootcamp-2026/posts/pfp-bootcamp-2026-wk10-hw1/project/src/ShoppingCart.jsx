import { useMemo } from "react";
import Product from "./Product";

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

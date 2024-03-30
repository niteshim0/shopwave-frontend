import axios from "axios";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/cartItemCard.component.jsx";
import toast from "react-hot-toast";
import cartReducer, {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
  removeItem,
} from "../../redux/reducer/cart.reducer.js";

const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector((state) => state.cartReducer);


  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState("");
  const [isValidCouponCode, setIsValidCouponCode] = useState(false);

  const incrementHandler = (cartItem) => {
    if (cartItem.quantity >= cartItem.stock) {
      toast.error("We don't have that much stock!");
      return;
    }

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem) => {
    
    if (cartItem.quantity <= 1){
      dispatch(removeCartItem(cartItem.productId));
      return;
    }

    dispatch(removeItem({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    const {token,cancel} = axios.CancelToken.source();
  

    const timeoutID = setTimeout(() => {
      axios
        .get(`${import.meta.env.VITE_SERVER}/api/v1/coupons/discount?code=${couponCode}`, {
          cancelToken: token,
        })
        .then((res) => {
          if(subtotal>=res.data.data){
           dispatch(discountApplied(res.data.data));
           setIsValidCouponCode(true);
           dispatch(calculatePrice());
           return;
          }else{
            dispatch(discountApplied(0));
            setIsValidCouponCode(false);
            dispatch(calculatePrice());
            toast.error("Coupon is not valid for this amount");
          }
          
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setIsValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);

    return () => {
      clearTimeout(timeoutID);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        <h1>Cart Items : {cartItems.length}</h1>
        {cartItems.length > 0 ? (
          cartItems.map((item, idx) => (
            <CartItemCard
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              key={idx}
              cartItem={item}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;

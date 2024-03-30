import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from "react-router-dom";
import { useNewOrderMutation } from '../../redux/api/orderAPI.js';
import { resetCart } from '../../redux/reducer/cart.reducer.js';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

const CheckOutForm = () => {
  
  //order , shippingInfo and which user
  const user = useSelector(state => state.userReducer.userGlobal);
  const cart = useSelector(state => state.cartReducer);
  const { 
    cartItems, 
    discount, 
    shippingCharges, 
    shippingInfo, 
    subtotal, 
    tax, 
    total 
  } = cart;

  const newOrderData = { 
    orderItems: cartItems, 
    discount, 
    shippingCharges, 
    shippingInfo, 
    subTotal : subtotal,
    tax,
    user,
    status : "Processing", 
    total 
  };

  console.log(newOrderData?.orderItems);

  const [newOrder] = useNewOrderMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const stripe = useStripe();
  const elements = useElements();
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect : "if_required"
    });

    
    
    if (result.error) {
      toast.error(result.error.message);
      console.log(result.error.message)
      return;
    }
    if(result.paymentIntent.status === "succeeded"){
      try {
      const res = await newOrder(newOrderData);
      dispatch(resetCart());
      toast.success("Order Placed Successfully");
      navigate('/orders');
      }catch(error){
        toast.error("Error placing order : " + error)
      }
   }else{
     toast.error("Payment Failed.If any amount deducted from acoount will be refunded within 24 hours.")
   }

  }
  return (
    <div className='checkout-container'>
    <form onSubmit={submitHandler}>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
    </form>
    </div>
  );
};

const Checkout = () => {

  const location = useLocation();
  const clientSecret = location.state;

  const options = {
    clientSecret: clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckOutForm />
    </Elements>
  );
};

export default Checkout;

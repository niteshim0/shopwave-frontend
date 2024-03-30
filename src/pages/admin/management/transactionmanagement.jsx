import React from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderMutation } from "../../../../redux/api/orderAPI.js";
import AdminSidebar from "../../../components/admin/AdminSidebar.tsx";
import { Skeleton } from "../../../components/loader.component.jsx";

const TransactionManagement = () => {
  const user = useSelector(state => state.userReducer.userGlobal);
  const params = useParams();
  const navigate  = useNavigate();

  const {isLoading,isError,error,data} = useOrderDetailsQuery(params.id);
  const responseData = data?.data;

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const updateHandler = async () => {
    try{
      const response = await updateOrder({
          userId : user?._id,
          orderId: responseData?._id
        }
      )
      toast.success(response?.data?.message);
      navigate("/admin/transaction") 
    }catch(error){
      console.error(error);
      toast.error("Failed to update order");
    }
  }

  const deleteHandler = async () => {
    try{
      const response = await deleteOrder({
          userId : user?._id,
          orderId: responseData?._id
        }
      )
      toast.success("Order deleted successfully");
      navigate("/admin/transaction") 
    }catch(error){
      console.error(error);
      toast.error("Failed to delete order");
    }
  }

  return (
   <div className="admin-container">
    <AdminSidebar />
    <main className="product-management">
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
        <section style = {{padding: "2rem"}}>
          <h2>Order Items</h2>
            {responseData?.orderItems.map((item) => (
              <ProductCard 
                key={item._id}
                name={item.name}
                photo={item.photo}
                productId={item.productId}
                _id = {item._id} 
                quantity={item.quantity}
                price={item.price}
              />
            ))}
        </section>
        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash/>
          </button>
          <h1>Order Information</h1>
          <h5>User Info</h5>
          <p>Name: {responseData?.user.name}</p>
          <p>Email: {responseData?.user.email}</p>
          <h5>Shipping Info</h5>
          <p>Address: {responseData?.shippingInfo.address}</p>
          <p>City: {responseData?.shippingInfo.city}</p>
          <p>State: {responseData?.shippingInfo.state}</p>
          <p>Postal Code: {responseData?.shippingInfo.pinCode}</p>
          <p>Country: {responseData?.shippingInfo.country}</p>
        </article>
        <article className="order-status-card">
        <h3>Amount Info</h3>
          <p>Subtotal: {responseData?.subTotal}</p>
          <p>Tax: {responseData?.tax}</p>
          <p>Shipping Charges: {responseData?.shippingCharges}</p>
          <p>Discount: {responseData?.discount}</p>
          <p>Total: {responseData?.total}</p>
          <h3>Order Status</h3>
          <p>Status: {""}
          <span className={
            responseData?.status === "Delivered" ? "purple" :
            responseData?.status === "Shipped" ? "green" :
            responseData?.status === "Processing" ? "red" : null
          }>
            {responseData?.status}
          </span>
          </p>
          <button onClick={updateHandler}>Update Order</button>   
        </article>
        </>
      )}
    </main>
   </div>
  )
}

const ProductCard = ({ productId, photo, name, price, quantity, _id }) => {
  return (
    <div className="transaction-product-card">
      <img src={photo} alt={name} />
      <Link to = {`/product/${productId}`}>{name}</Link>
      <span>Quantity: {quantity}</span>
      <span>₹{price*quantity}</span>
    </div>
  );
} 

export default TransactionManagement;
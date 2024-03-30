import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useLatestProductsQuery } from "../../redux/api/productAPI.js";
import { addToCart } from "../../redux/reducer/cart.reducer.js";
import ProductCard from "../components/productCard.component.jsx";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const dispatch = useDispatch();

  const addToCartHandler = (product) => {
    if (product.stock < 1) {
      toast.error("Out of Stock");
      return;
    }

    const cartItem = {
      productId: product._id,
      quantity: 1,
      price: Number(product.price),
      name: product.name,
      photo: product.photo,
      stock: Number(product.stock),
    };


    dispatch(addToCart(cartItem));
    toast.success("Product Added to Cart");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    toast.error("Cannot Fetch the Latest Products");
  }

  return (
    <div className="home">
      <h1>
        Latest Products
        <Link to="/search" className="findMore">
          Find More
        </Link>
      </h1>
      <main>
        {data?.data.map((product) => (
          <ProductCard
            key={product._id}
            productId={product._id}
            name={product.name}
            price={product.price}
            stock={product.stock}
            handler={()=>addToCartHandler(product)}
            photo={product.photo}
          />
        ))}
      </main>
    </div>
  );
};

export default Home;

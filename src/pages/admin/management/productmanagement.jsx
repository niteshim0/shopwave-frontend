import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../../../redux/api/productAPI.js";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader.component.jsx";

const ProductManagement = () => {
  const user = useSelector((state) => state.userReducer.userGlobal);
  const params = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useProductDetailsQuery(params.id);

  const { name, price, stock, category, photo } = data?.data || {
    name: "",
    price: 0,
    stock: 0,
    category: "",
    photo: "",
  };

  const [priceUpdate, setPriceUpdate] = useState(price);
  const [stockUpdate, setStockUpdate] = useState(stock);
  const [nameUpdate, setNameUpdate] = useState(name);
  const [categoryUpdate, setCategoryUpdate] = useState(category);
  const [photoUpdate, setPhotoUpdate] = useState("");
  const [photoFile, setPhotoFile] = useState();

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const changeImageHandler = (e) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", priceUpdate.toString());
    if (stockUpdate !== undefined)
      formData.set("stock", stockUpdate.toString());
    if (photoFile) formData.set("photo", photoFile);
    if (categoryUpdate) formData.set("category", categoryUpdate);

    try {
      const response = await updateProduct({
        formData,
        userId: user?._id,
        productId: data?.data._id,
      });
      toast.success(response?.data?.message);
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  const deleteHandler = async () => {
    try {
      await deleteProduct({
        userId: user?._id,
        productId: data?.data._id,
      }).unwrap();
      // Since there's no error, the deletion was successful
      toast.success("Product deleted successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };  

  useEffect(() => {
    if (data) {
      setNameUpdate(data?.data.name);
      setPriceUpdate(data?.data.price);
      setStockUpdate(data?.data.stock);
      setCategoryUpdate(data?.data.category);
      setPhotoUpdate(data?.data.photo); // Update photo state
    }
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <strong>ID - {data?.data._id}</strong>
              <img src={`${photo}`} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photo</label>
                  <input type="file" onChange={changeImageHandler} />
                </div>

                {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;

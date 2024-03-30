import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC.jsx";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useAllProductsQuery } from "../../../redux/api/productAPI";
import { Skeleton } from "../../components/loader.component.jsx";


const Products = () => {
  const user = useSelector(state => state.userReducer.userGlobal);
  const { isLoading, isError, error, data } = useAllProductsQuery(user?._id);
  const responseData = data?.data;
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (responseData) {
      setRows(
        responseData.map((product) => ({
          photo: <img src={`${product?.photo}`} alt={product.name} />,
          name: product.name,
          price: product.price,
          stock: product.stock,
          action: <Link to={`/admin/product/${product._id}`}>Manage</Link>,
        }))
      );
    }
  }, [responseData]);

  const columns = [
    {
      Header: "Photo",
      accessor: "photo",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Price",
      accessor: "price",
    },
    {
      Header: "Stock",
      accessor: "stock",
    },
    {
      Header: "Action",
      accessor: "action",
    },
  ];

  const Table = TableHOC(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : <Table />}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;

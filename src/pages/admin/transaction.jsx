import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAllOrdersQuery } from '../../../redux/api/orderAPI.js';
import AdminSidebar from '../../components/admin/AdminSidebar.tsx';
import TableHOC from '../../components/admin/TableHOC.jsx';
import { Skeleton } from '../../components/loader.component.jsx';
import { Link } from 'react-router-dom';

const Transaction = () => {
  const columns = [
    {
      Header: "User",
      accessor: "user.name",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Discount",
      accessor: "discount",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Action",
      accessor: "action",
    },
  ];

  const user = useSelector(state => state.userReducer.userGlobal);

  const { isLoading, isError, error, data } = useAllOrdersQuery(user?._id);
  const responseData = data?.data;
  const [rows, setRows] = useState([]);


  const calculateTotalQuantity = (orderItems) => 
  ( orderItems.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0));
  
  

  useEffect(() => {
    if (responseData) {
      setRows(
        responseData.map((order) => ({
          user: order.user,
          amount: order.total,
          discount: order.discount,
          quantity: calculateTotalQuantity(order.orderItems),
          status: (
            <span
              key={order._id}
              className={
                order.status === "Processing"
                  ? "red"
                  : order.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {order.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>,
        }))
      );
    }
  }, [responseData]);

  const Table = TableHOC(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : isError ? <div>Error: {error.message}</div> : <Table />}</main>
    </div>
  );
};

export default Transaction;

import React, { useEffect ,useState } from "react";
import { useSelector } from "react-redux";
import { useMyOrdersQuery } from "../../redux/api/orderAPI.js";
import AdminSidebar from "../components/admin/AdminSidebar.tsx";
import { Skeleton } from "../components/loader.component.jsx";
import TableHOC from "../components/admin/TableHOC.jsx";
import { Link } from "react-router-dom";

const Orders = () => {


  const user = useSelector((state) => state.userReducer.userGlobal);
  console.log(user);
  const {isLoading, isError, error, data}  = useMyOrdersQuery(user?._id);
  const responseData = data?.data;
  console.log(responseData);
  const [rows, setRows] = useState([]);

  const columns = [
    {
      Header: "ID",
      accessor: "_id",
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

  const calculateTotalQuantity = (orderItems) => (orderItems.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0));

  useEffect(() => {
    if (responseData) {
      setRows(
        responseData.map((order) => ({
          _id: order._id,
          amount: order.total,
          discount: order.discount,
          quantity: calculateTotalQuantity(order.orderItems),
          status: (
            <span className={
              order?.status === "Delivered" ? "purple" :
              order?.status === "Shipped" ? "green" :
              order?.status === "Processing" ? "red" : null
            }>
              {order?.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>,
        }))
      );
    }
  }, [data]);

  const Table = TableHOC(
    columns,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : <Table columns={columns} data={rows} />}</main>
    </div>
  );
};

export default Orders;
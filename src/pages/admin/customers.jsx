import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { useSelector } from 'react-redux';
import { useAllUsersQuery, useDeleteUsersMutation } from '../../../redux/api/userAPI.js';
import TableHOC from '../../components/admin/TableHOC.jsx';
import AdminSidebar from '../../components/admin/AdminSidebar.tsx';
import { Skeleton } from '../../components/loader.component.jsx';
import { FaTrash } from 'react-icons/fa';

const Customers = () => {
  
  const columns = [
    {
      Header: "Avatar",
      accessor: "avatar",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Gender",
      accessor: "gender",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "Action",
      accessor: "action",
    },
  ];

  const user = useSelector(state => state.userReducer.userGlobal);
  const { isLoading, isError, error, data } = useAllUsersQuery(user?._id);
  const [rows, setRows] = useState([]);

  const [deleteUser] = useDeleteUsersMutation();

  const deleteHandler = async(userId) => {
    try {
      const res = await deleteUser({ userId, adminId: user?._id });
      toast.success("User Deleted Successfully")
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user")
    }
  }

  if (isError) {
    toast.error("Something went wrong while getting all users");
  }

  useEffect(() => {
    if (data) {
      const users = data?.data?.users;
      setRows(
        users.map((user) => ({
          avatar: (
            <img
              style={{
                borderRadius: "50%",
              }}
              src={user.photo}
              alt={user.name}
            />
          ),
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          action: (
            <button onClick={() => deleteHandler(user.email)}>
              <FaTrash />
            </button>
          ),
        }))
      );
    }
  }, [data]);

  const Table = TableHOC(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : isError ? <div>Error: {error.message}</div> : <Table />}</main>
    </div>
  );
}

export default Customers;

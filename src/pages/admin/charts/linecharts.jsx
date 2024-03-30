import React from 'react';
import {useSelector} from 'react-redux';
import toast from "react-hot-toast";
import AdminSidebar from "../../../components/admin/AdminSidebar.tsx";
import { LineChart } from "../../../components/admin/Charts.tsx";
import { Skeleton } from "../../../components/loader.component.jsx";
import { getLastMonths } from "../../../utils/features.js";
import { useLineQuery } from '../../../../redux/api/dashboardAPI.js';

const { last12Months: months } = getLastMonths();

const Linecharts = () => {
 
  const user = useSelector(state => state.userReducer.userGlobal);
  const { isLoading, data, error, isError } = useLineQuery(user?._id);

  const users = (data?.data?.users) || [];
  const products = (data?.data?.products) || [];
  const revenue = (data?.data?.revenue) || [];
  const discount = (data?.data?.discount) || [];
  
  if(isError){
    toast.error(error.data.message);
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Line Charts</h1>

        {isLoading ? (
          <Skeleton length={15} />
        ) : (
          <>
            <section>
              <LineChart
                data={users}
                label="Users"
                borderColor="rgb(53, 162, 255)"
                labels={months}
                backgroundColor="rgba(53, 162, 255, 0.5)"
              />
              <h2>Active Users</h2>
            </section>

            <section>
              <LineChart
                data={products}
                backgroundColor={"hsla(269,80%,40%,0.4)"}
                borderColor={"hsl(269,80%,40%)"}
                labels={months}
                label="Products"
              />
              <h2>Total Products</h2>
            </section>

            <section>
              <LineChart
                data={revenue}
                backgroundColor={"hsla(129,80%,40%,0.4)"}
                borderColor={"hsl(129,80%,40%)"}
                label="Revenue"
                labels={months}
              />
              <h2>Total Revenue </h2>
            </section>

            <section>
              <LineChart
                data={discount}
                backgroundColor={"hsla(29,80%,40%,0.4)"}
                borderColor={"hsl(29,80%,40%)"}
                label="Discount"
                labels={months}
              />
              <h2>Discount Allotted </h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Linecharts;

import React,{useEffect,useState} from 'react';
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useStatsQuery } from '../../../redux/api/dashboardAPI.js';
import AdminSidebar from '../../components/admin/AdminSidebar.tsx';
import { Skeleton } from '../../components/loader.component.jsx';
import { getLastMonths } from '../../utils/features.js'; 
import { BarChart, DoughnutChart } from '../../components/admin/Charts.tsx'; // import both charts in one line
import { BiMaleFemale } from "react-icons/bi";
import TableHOC from '../../components/admin/TableHOC.jsx';

const userImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp";

const { last6Months: months } = getLastMonths();

const Dashboard = () => {

  const [rows,setRows] = useState([]);
  
  const columns = [
    {
      Header: "Id",
      accessor: "_id",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
    },
    {
      Header: "Discount",
      accessor: "discount",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ];





  const user = useSelector(state => state.userReducer.userGlobal);
  const { isLoading, data, isError } = useStatsQuery(user?._id);

  const stats = data?.data;


  useEffect(() => {
    if (data) {
      const latestTransactions = data?.data?.latestTransactions;
      setRows(
        latestTransactions.map((transaction) => ({
          _id: transaction._id,
          amount : transaction.amount,
          quantity: transaction.quantity,
          discount : transaction.discount,
          status: (
            <span
              key={transaction._id}
              className={
                transaction.status === "Processing"
                  ? "red"
                  : transaction.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {transaction.status}
            </span>
          ),
        }))
      );
    }
  }, [data]);

  const Table = TableHOC(
    columns,
    rows,
    "dashboard-product-box",
    "Latest Transactions",
    rows.length > 6
  );

  if (isError) return <Navigate to={"/"} />

  return (
    <div className='admin-container'>
      <AdminSidebar />
      <main className="dashboard">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
            <>
              <div className="bar">
                <BsSearch />
                <input type="text" placeholder="Search for data, users, docs" />
                <FaRegBell />
                <img src={user?.photo || userImg} alt="User" />
              </div>

              <section className="widget-container">
                {stats && (
                  <>
                    <WidgetItem
                      percent={stats.changePercent.revenue}
                      amount={true}
                      value={stats.count.revenue}
                      heading="Revenue"
                      color="rgb(0, 115, 255)"
                    />
                    <WidgetItem
                      percent={stats.changePercent.user}
                      value={stats.count.user}
                      color="rgb(0 198 202)"
                      heading="Users"
                    />
                    <WidgetItem
                      percent={stats.changePercent.orders}
                      value={stats.count.order}
                      color="rgb(255 196 0)"
                      heading="Transactions"
                    />

                    <WidgetItem
                      percent={stats.changePercent.product}
                      value={stats.count.product}
                      color="rgb(76 0 255)"
                      heading="Products"
                    />
                  </>
                )}
              </section>

              <section className="graph-container">
                {stats && (
                  <div className="revenue-chart">
                    <h2>Revenue & Transaction</h2>
                    <BarChart
                      labels={months}
                      data_1={stats.chart.revenue}
                      data_2={stats.chart.order}
                      title_1="Revenue"
                      title_2="Transaction"
                      bgColor_1="rgb(0, 115, 255)"
                      bgColor_2="rgba(53, 162, 235, 0.8)"
                    />
                  </div>
                )}

                {stats && (
                  <div className="dashboard-categories">
                    <h2>Inventory</h2>

                    <div>
                      {stats.categoryCount.map((i) => {
                        const [heading, value] = Object.entries(i)[0];
                        return (
                          <CategoryItem
                            key={heading}
                            value={value}
                            heading={heading}
                            color={`hsl(${value * 4}, ${value}%, 50%)`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              <section className="transaction-container">
                {stats && (
                  <div className="gender-chart">
                    <h2>Gender Ratio</h2>
                    <DoughnutChart
                      labels={["Female", "Male"]}
                      data={[stats.userRatio.female, stats.userRatio.male]}
                      backgroundColor={[
                        "hsl(340, 82%, 56%)",
                        "rgba(53, 162, 235, 0.8)",
                      ]}
                      cutout={90}
                    />
                    <p>
                      <BiMaleFemale />
                    </p>
                  </div>
                )}
                {stats && <Table />}
              </section>
            </>
          )}
      </main>
    </div>
  )
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}) => (
    <article className="widget">
      <div className="widget-info">
        <p>{heading}</p>
        <h4>{amount ? `₹${value}` : value}</h4>
        {percent > 0 ? (
          <span className="green">
            <HiTrendingUp /> +{`${percent > 10000 ? 9999 : percent}%`}
          </span>
        ) : (
            <span className="red">
              <HiTrendingDown /> {`${percent < -10000 ? -9999 : percent}%`}
            </span>
          )}
      </div>

      <div
        className="widget-circle"
        style={{
          background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
        }}
      >
        <span
          style={{
            color,
          }}
        >
          {percent > 0 && `${percent > 10000 ? 9999 : percent}%`}
          {percent < 0 && `${percent < -10000 ? -9999 : percent}%`}
        </span>
      </div>
    </article>
  );

const CategoryItem = ({ color, value, heading }) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;

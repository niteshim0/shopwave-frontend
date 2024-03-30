import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header.component.jsx";
import Loader from "./components/loader.component.jsx";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "../redux/reducer/user.reducer.js";
import { getUser } from "../redux/api/userAPI.js"
import ProtectedRoute from "./components/protectedRoute.component.jsx";


const Home = lazy(() => import("./pages/home.page.jsx"));
const Search = lazy(() => import("./pages/search.page.jsx"));
const Cart = lazy(() => import("./pages/cart.page.jsx"));
const Login = lazy(() => import("./pages/login.page.jsx"));
const Orders = lazy(() => import("./pages/order.page.jsx"));
const Shipping = lazy(() => import("./pages/shipping.page.jsx"));
const Checkout = lazy(() => import("./pages/checkout.jsx"));


// Admin Routes
const Dashboard = lazy(() => import('./pages/admin/dashboard.jsx'));
const Products = lazy(() => import('./pages/admin/products.jsx'));
const Customers = lazy(() => import('./pages/admin/customers.jsx'));
const Transaction = lazy(() => import('./pages/admin/transaction.jsx'));
const Barcharts = lazy(() => import('./pages/admin/charts/barcharts.jsx'));
const Piecharts = lazy(() => import('./pages/admin/charts/piecharts.jsx'));
const Linecharts = lazy(() => import('./pages/admin/charts/linecharts.jsx'));
const Coupon = lazy(() => import('./pages/admin/apps/coupon'));
const Stopwatch = lazy(() => import('./pages/admin/apps/stopwatch'));
const Toss = lazy(() => import('./pages/admin/apps/toss'));
const NewProduct = lazy(() => import('./pages/admin/management/newproduct'));
const ProductManagement = lazy(() => import('./pages/admin/management/productmanagement'));
const TransactionManagement = lazy(() =>
  import('./pages/admin/management/transactionmanagement.jsx')
);

const App = () => {

  const {userGlobal,loading} = useSelector((state)=>state.userReducer);


  const dispatch = useDispatch();
  
  useEffect(()=>{
    onAuthStateChanged(auth,async (user) =>{
      if(user){
        const loginResponse = await getUser(user?.email);
        dispatch(userExist(loginResponse?.data?.user));

        console.log("User Logged In");
      }else{
        dispatch(userNotExist());
      }
    })
  },[]);



  return (
    <BrowserRouter>
      <Header user={userGlobal} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          

          {/*Protected Route because we don't want to allow this page when user logged in*/}
          <Route  path = "/login"
            element = {
              <ProtectedRoute isAuthenticated={!userGlobal}>
                <Login/>
              </ProtectedRoute>
          }/>

          {/* Login Required for these routes */}
          <Route  element={<ProtectedRoute isAuthenticated={userGlobal ? true : false} />}>
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payment" element={<Checkout />} />
          </Route>





          {/* Admin Routes */}
          <Route path="/admin/*" element=
                {<ProtectedRoute isAuthenticated={true}
                adminOnly={true}
                admin={userGlobal?.role ==="admin"  ? true : false}>
                <AdminRoutes/>
                </ProtectedRoute>
                } 
          />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center"/>
    </BrowserRouter>
  );
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/product" element={<Products />} />
      <Route path="/customer" element={<Customers />} />
      <Route path="/transaction" element={<Transaction />} />
      {/* Charts */}
      <Route path="/chart/bar" element={<Barcharts />} />
      <Route path="/chart/pie" element={<Piecharts />} />
      <Route path="/chart/line" element={<Linecharts />} />
      {/* Apps */}
      <Route path="/app/coupon" element={<Coupon />} />
      <Route path="/app/stopwatch" element={<Stopwatch />} />
      <Route path="/app/toss" element={<Toss />} />
      {/* Management */}
      <Route path="/product/new" element={<NewProduct />} />
      <Route path="/product/:id" element={<ProductManagement />} />
      <Route path="/transaction/:id" element={<TransactionManagement />} />
    </Routes>
  );
};

export default App;
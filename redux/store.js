import { configureStore } from '@reduxjs/toolkit';
import { productAPI } from './api/productAPI.js';
import { userAPI } from './api/userAPI';
import cartReducer from './reducer/cart.reducer.js';
import userReducer from './reducer/user.reducer.js';
import { orderAPI } from './api/orderAPI.js';
import { dashboardAPI } from './api/dashboardAPI.js';

const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    [dashboardAPI.reducerPath] : dashboardAPI.reducer,
    userReducer: userReducer,
    cartReducer : cartReducer,
  },
  middleware : (mid) =>[...mid(),userAPI.middleware,productAPI.middleware,orderAPI.middleware,dashboardAPI.middleware],
});

export default store;




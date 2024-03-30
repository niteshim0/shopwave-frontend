import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderAPI = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/orders/`,
  }),
  tagTypes: ["order"],
  endpoints: (builder) => ({
    newOrder: builder.mutation({
      query: (order) => ({
        url: `new`,
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["order"],
    }),

    updateOrder: builder.mutation({
      query: ({orderId,userId}) => ({
        url: `${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["order"],
    }),

    deleteOrder: builder.mutation({
      query: ({orderId,userId}) => ({
        url: `${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["order"],
    }),

    myOrders: builder.query({
      query: (id) => `myOrders?id=${id}`,
      providesTags: ["order"],
    }),

    allOrders: builder.query({
      query: (id) => `all-orders?id=${id}`,
      providesTags: ["order"],
    }),

    orderDetails: builder.query({
      query: (id) => `${id}`,
      providesTags: ["order"],
    }),
  }),
});

export const {
  useNewOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useMyOrdersQuery,
  useAllOrdersQuery,
  useOrderDetailsQuery,
} = orderAPI;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

//in unique api id for users we are sending email of that user
export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/users/` }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user
      }),
      invalidatesTags: ["users"],
    }),
    deleteUsers: builder.mutation({
      query: ({userId,adminId}) => ({
        url: `${userId}?id=${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
    allUsers: builder.query({
      query: (id) => `all?id=${id}`,
      providesTags: ["users"],
    }),
  }),
});

const getUser = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/users/${id}`
    );
    const data = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};


export {getUser};



export const { useLoginMutation, useDeleteUsersMutation, useAllUsersQuery } = userAPI;

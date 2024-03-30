import { createSlice} from "@reduxjs/toolkit";

const initialState  = {
  userGlobal: null,
  loading: true,
};

const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action) => {
      state.loading = false;
      state.userGlobal = action.payload;
    },
    userNotExist: (state) => {
      state.loading = false;
      state.userGlobal = null;
    },
  },
});

export default userReducer.reducer;

export const { userExist, userNotExist } = userReducer.actions;

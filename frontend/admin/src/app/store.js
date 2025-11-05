import { configureStore } from "@reduxjs/toolkit";
import { globalReducer } from "../features/global/globalSlice";
import { authReducer } from "../features/auth/authSlice";
import { productReducer } from "../features/products/productSlice";
import { categoryReducer } from "../features/categories/categorySlice";
import { brandReducer } from "../features/brands/brandSlice";
import { userReducer } from "../features/users/userSlice";


const initialState = {
}

const store = configureStore({
    reducer: {
        global: globalReducer,
        auth: authReducer,
        products: productReducer,
        categories: categoryReducer,
        brands: brandReducer,
        users: userReducer
    },
    preloadedState: initialState,
})

export default store;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../features/brands/brandSlice";
import { fetchCategories } from "../features/categories/categorySlice";

export const useFetchOptions = () => {
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.brands);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    if (!brands?.length) dispatch(fetchBrands());
    if (!categories?.length) dispatch(fetchCategories());
  }, [dispatch]);

  return { brands, categories };
};

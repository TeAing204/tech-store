import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchBrands } from "../features/brands/brandSlice";

const useBrandFilter = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams();

    // pageNumber (Spring Boot bắt đầu từ 0)
    const currentPage = searchParams.get("pageNumber")
      ? Number(searchParams.get("pageNumber"))
      : 1;
    params.set("pageNumber", currentPage - 1);

    // pageSize
    const pageSize = searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : 20;
    params.set("pageSize", pageSize);

    if (searchParams.get("status")) {
      params.set("status", searchParams.get("status"));
    }
    // filter
    const keyword = searchParams.get("keyword") || null;
    if (keyword) params.set("keyword", keyword);

    dispatch(fetchBrands({ params }));
  }, [dispatch, searchParams]);
};

export default useBrandFilter;

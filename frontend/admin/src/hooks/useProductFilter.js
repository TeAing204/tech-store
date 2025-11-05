import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchTrashProducts } from "../features/products/productSlice";

const useProductFilter = (type = "products") => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = {};
    // pageNumber (Spring Boot bắt đầu từ 0)
    const currentPage = searchParams.get("pageNumber")
      ? Number(searchParams.get("pageNumber"))
      : 1;
    params.pageNumber = currentPage - 1;

    // pageSize
    params.pageSize = searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : 20;

    // sort
    params.sortBy = searchParams.get("sortBy") || "price";
    params.sortOrder = searchParams.get("order") || "asc";

    // filter
    if (searchParams.get("category")) {
      params.categoryId = searchParams.get("category");
    }
    if (searchParams.get("brand")) {
      params.brandId = searchParams.get("brand");
    }
    if (searchParams.get("keyword")) {
      params.keyword = searchParams.get("keyword");
    }
    if(type === "products"){
      dispatch(fetchProducts(params));
    } else {
      dispatch(fetchTrashProducts(params));
    }
  }, [dispatch, searchParams]);
};

export default useProductFilter;

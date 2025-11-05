import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchTrashUsers, fetchUsers } from "../features/users/userSlice";

const useUserFilter = (type = "user") => {
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
    params.sortBy = searchParams.get("sortBy") || "userId";
    params.sortOrder = searchParams.get("order") || "asc";

    // filter
    if (searchParams.get("role")){
      params.roleId = searchParams.get("role");
    }
    if(searchParams.get("status")){
      params.status = searchParams.get("status");
    }
    // search
    if (searchParams.get("keyword")) {
      params.keyword = searchParams.get("keyword");
    }
    if (type === "user"){
      dispatch(fetchUsers({params}));
    } else {
      dispatch(fetchTrashUsers({params}));
    }
  }, [dispatch, searchParams]);
};

export default useUserFilter;

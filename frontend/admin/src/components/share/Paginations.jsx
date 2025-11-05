import { Pagination, FormControl, MenuItem, Select, Box } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Paginations = ({ numberOfPage }) => {
  const [searchParams] = useSearchParams();
  const pathname = useLocation().pathname;
  const params = new URLSearchParams(searchParams);
  const navigate = useNavigate();

 // page hiện tại (backend dùng pageNumber, mặc định 1)
    const paramValue = searchParams.get("pageNumber")
    ? Number(searchParams.get("pageNumber"))
    : 1;

    // rowsPerPage (limit = pageSize)
    const rowsPerPage = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : 20;

  // đổi trang
  const onChangeHandler = (event, value) => {
    params.set("pageNumber", value.toString());
    params.set("pageSize", rowsPerPage.toString());
    navigate(`${pathname}?${params}`);
  };

  // đổi số sản phẩm/trang
  const onRowsPerPageChange = (event) => {
    params.set("pageNumber", "1"); // reset về page 1
    params.set("pageSize", event.target.value);
    navigate(`${pathname}?${params}`);
  };

  return (
    <Box className="my-10" display="flex" justifyContent="space-between" width="100%" alignItems="center" gap={2}>
      {/* Dropdown chọn số sản phẩm/trang */}
      <FormControl size="small">
        <Select value={rowsPerPage} onChange={onRowsPerPageChange}>
          <MenuItem value={5}>5 / trang</MenuItem>
          <MenuItem value={10}>10 / trang</MenuItem>
          <MenuItem value={20}>20 / trang</MenuItem>
          <MenuItem value={50}>50 / trang</MenuItem>
        </Select>
      </FormControl>

      {/* Pagination */}
      <Pagination
        count={numberOfPage}
        variant="outlined"
        page={paramValue}
        defaultPage={1}
        siblingCount={0}
        boundaryCount={2}
        shape="rounded"
        onChange={onChangeHandler}
      />
    </Box>
  );
};

export default Paginations;

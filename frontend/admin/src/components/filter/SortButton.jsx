import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useState, useEffect } from "react";

const SortButton = ({ queryKey = "order" }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [sortOrder, setSortOrder] = useState(searchParams.get(queryKey) || "asc");

  useEffect(() => {
    const currentOrder = searchParams.get(queryKey) || "asc";
    setSortOrder(currentOrder);
  }, [searchParams]);

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    searchParams.set(queryKey, newOrder);
    navigate(`${pathname}?${searchParams.toString()}`);
    setSortOrder(newOrder);
  };

  return (
    <Tooltip title={sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}>
      <Button
        onClick={toggleSortOrder}
        variant="outlined"
        color="secondary"
        sx={{ fontWeight: "bold", height: 38 }}
        className="flex items-center gap-2"
      >
        <span>Sắp xếp</span>
        {sortOrder === "asc" ? <ArrowUpwardIcon size={20} /> : <ArrowDownwardIcon size={20} />}
      </Button>
    </Tooltip>
  );
};

export default SortButton;

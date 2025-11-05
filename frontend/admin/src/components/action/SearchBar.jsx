import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const SearchBar = ({ queryKey = "keyword", delay = 600, placeholder = "Tìm kiếm..." }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [term, setTerm] = useState(searchParams.get(queryKey) || "");
  
  useEffect(() => {
    const current = searchParams.get(queryKey) || "";
    setTerm(current);
  }, [searchParams, queryKey]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (term) searchParams.set(queryKey, term);
      else searchParams.delete(queryKey);
      navigate(`${pathname}?${searchParams.toString()}`);
    }, delay);
    return () => clearTimeout(handler);
  }, [term]);

  return (
    <div className="relative flex items-center 2xl:w-[450px] sm:w-[300px] w-full">
      <TextField
        variant="outlined"
        size="small"
        placeholder={placeholder}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": { height: 40 },
        }}
      />
    </div>
  );
};

export default SearchBar;

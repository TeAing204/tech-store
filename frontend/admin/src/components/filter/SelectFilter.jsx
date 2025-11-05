import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const SelectFilter = ({
  queryKey,
  label,
  options = [],
  defaultValue = "all",
  allText = "Tất cả",
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const currentValue = searchParams.get(queryKey) || defaultValue;

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === defaultValue) searchParams.delete(queryKey);
    else searchParams.set(queryKey, value);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <FormControl variant="outlined" size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={currentValue}
        label={label}
        onChange={handleChange}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value={defaultValue}>{allText}</MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;

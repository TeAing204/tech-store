
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import FlexBetween from "../share/FlexBetween";
import React, { useEffect, useState } from "react";
import axios from "axios";


const SelectForm = ({
  name,
  title,
  action,
  linkAction,
  control,
  options = [],
  fetchUrl,
  valueKey = "id",
  labelKey = "name",
}) => {
  const [fetchedOptions, setFetchedOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!fetchUrl) return;
      try {
        const res = await axios.get(fetchUrl);
        setFetchedOptions(res.data || []);
      } catch (err) {
        console.error("Fetch select options error:", err);
      }
    };
    fetchData();
  }, [fetchUrl]);

  // Quyết định dùng options tĩnh hay động
  const finalOptions = fetchUrl ? fetchedOptions : options;

  return (
    <Box>
      <FlexBetween className="py-2 mt-2">
        <p className="text-base font-semibold">{title}</p>
        {action && (
          <Link to={linkAction || "#"} className="text-[#ffd166]">
            {action}
          </Link>
        )}
      </FlexBetween>

      <FormControl fullWidth>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          rules={{ required: `Vui lòng chọn ${title.toLowerCase()}` }}
          render={({ field, fieldState }) => (
            <>
              <Select
                {...field}
                size="small"
                displayEmpty
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <MenuItem value="">
                  <em>Chọn</em>
                </MenuItem>
                {finalOptions?.map((option) => (
                  <MenuItem
                    key={option[valueKey]}
                    value={option[valueKey]}
                  >
                    {option[labelKey]}
                  </MenuItem>
                ))}
              </Select>

              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </FormControl>
    </Box>
  );
};

export default React.memo(SelectForm);

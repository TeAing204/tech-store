import { useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";


const BulkActionBar = ({
  selectedIds = [],
  actions = [],
  onApply,
  label = "Hành động",
}) => {
  const [action, setAction] = useState("");

  const handleApply = async () => {
    const ids = Array.isArray(selectedIds) ? selectedIds : Array.from(selectedIds || []);

    try {
        await onApply({ action, selectedIds: ids });
    }finally {
        setAction("");
    }
    };


  return (
    <Box className="flex items-center gap-3">
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="bulk-action-select-label">{label}</InputLabel>
        <Select
          labelId="bulk-action-select-label"
          label={label}
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          {actions.map((act) => (
            <MenuItem key={act.value} value={act.value}>
              {act.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={handleApply}
        disabled={selectedIds.length === 0}
      >
        Áp dụng
      </Button>
    </Box>
  );
};

export default BulkActionBar;

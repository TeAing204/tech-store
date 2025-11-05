import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'

const Export = () => {
  const [exportType, setExportType] = useState("all");
  return (
    <div>
        <FormControl variant="outlined" size="small" className="text-slate-800 border-slate-700">
            <InputLabel id="category-select-label">Export</InputLabel>
            <Select className="min-w-[120px] text-slate-800 border-slate-700" labelId="category-select-label" 
                onChange={(e) => setExportType(e.target.value)} label="category" value={exportType || ""}>
                    <MenuItem value="all">Xuất</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="pdf">PDF</MenuItem>      
            </Select>
        </FormControl>
    </div>
  )
}

export default Export
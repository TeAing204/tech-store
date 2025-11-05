
import {
  Box,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import Paginations from "./Paginations";

const Table = ({ isLoading, data = [], columns = [], onSelectionChange, pagination=[], selectedIds: externalSelectedIds = [] }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (externalSelectedIds && externalSelectedIds.length >= 0) {
      setSelectedIds(externalSelectedIds);
    }
  }, [externalSelectedIds?.join(',')]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = data.map((row) => row.id || row.userId || row.categoryId);
      setSelectedIds(allIds);
      onSelectionChange?.(allIds);
    } else {
      setSelectedIds([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id) => {
    let newSelection;
    if (selectedIds.includes(id)) {
      newSelection = selectedIds.filter((item) => item !== id);
    } else {
      newSelection = [...selectedIds, id];
    }
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <Box mt="40px">
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            overflowX: "auto",
            width: "100%",
          }}
        >
          <MuiTable
            sx={{
              border: 0,
              minWidth: "800px",
              "& th": {
                fontWeight: 600,
                fontSize: "0.8rem",
                textAlign: "left",
                whiteSpace: "nowrap",
              },
              "& td": {
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
                py: "6px",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      data.length > 0 && selectedIds.length === data.length
                    }
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < data.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    style={{
                      minWidth: col.minWidth || 100,
                      width: col.flex ? `${col.flex * 100}px` : "auto",
                      textAlign:
                        col.align ||
                        (col.headerAlign === "center" ? "center" : "left"),
                    }}
                  >
                    {col.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    align="center"
                    sx={{ py: 3, color: "#6b7280" }}
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => {
                  const id = row.id || row.userId || row.categoryId || row.brandId;
                  return (
                    <TableRow key={id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.includes(id)}
                          onChange={() => handleSelectRow(id)}
                        />
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell
                          key={col.field}
                          align={
                            col.align ||
                            (col.headerAlign === "center" ? "center" : "left")
                          }
                        >
                          {col.renderCell
                            ? col.renderCell({ row, value: row[col.field] })
                            : row[col.field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>  
          </MuiTable>
          <Paginations numberOfPage={pagination.totalPages}/>
        </Box>
      )}
    </Box>
  );
};

export default Table;

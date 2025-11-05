import { Box, IconButton } from "@mui/material";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";

const STATUS_LABELS = {
  ACTIVE: "Hoạt động",
  PAUSED: "Tạm dừng",
  UNKNOWN: "Không xác định",
};

export const getBrandColumns = (handleEdit, handleDelete) => [
  { field: "brandName", headerName: "TÊN THƯƠNG HIỆU", flex: 2 },
  { field: "description", headerName: "MÔ TẢ", flex: 2 },
  {
    field: "status",
    headerName: "TRẠNG THÁI",
    flex: 2,
    renderCell: (params) => {
      const status = params.value?.toUpperCase?.() || "UNKNOWN";
      let color = "";
      let bg = "";

      switch (status) {
        case "ACTIVE":
          color = "#16a34a";
          bg = "rgba(22,163,74,0.1)";
          break;
        case "PAUSED":
          color = "#dc2626";
          bg = "rgba(220,38,38,0.1)";
          break;
        default:
          color = "#6b7280";
          bg = "rgba(107,114,128,0.1)";
          break;
      }

      const text = STATUS_LABELS[status] || STATUS_LABELS.UNKNOWN;

      return (
        <Box
          sx={{
            display: "inline-flex",
            border: `1px solid ${color}`,
            color,
            backgroundColor: bg,
            borderRadius: "4px",
            fontWeight: 600,
            fontSize: "0.875rem",
            textAlign: "center",
            lineHeight: 1.4,
            px: 1.5,
            py: 0.3,
          }}
        >
          {text}
        </Box>
      );
    },
  },
  {
    field: "createdBy",
    headerName: "TẠO BỞI",
    flex: 2,
    renderCell: (params) => {
      const createdBy = params.value || "Không rõ";
      const createdAt = params.row.createdAt
        ? dayjs(params.row.createdAt).format("DD/MM/YYYY HH:mm")
        : "Chưa có";

      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600 }}>{createdBy}</span>
          <span style={{ fontSize: 12, color: "#666" }}>{createdAt}</span>
        </div>
      );
    },
  },
  {
    field: "updatedBy",
    headerName: "CẬP NHẬT BỞI",
    flex: 2,
    renderCell: (params) => {
      const updatedBy = params.value || "Chưa có";
      const updatedAt = params.row.updatedAt
        ? dayjs(params.row.updatedAt).format("DD/MM/YYYY HH:mm")
        : "Chưa có";

      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600 }}>{updatedBy}</span>
          <span style={{ fontSize: 12, color: "#666" }}>{updatedAt}</span>
        </div>
      );
    },
  },
  {
    field: "totalProducts",
    headerName: "SẢN PHẨM",
    flex: 2,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "action",
    headerName: "HÀNH ĐỘNG",
    flex: 0.5,
    sortable: false,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <IconButton color="secondary" onClick={() => handleEdit(params.row)}>
          <EditSquareIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => handleDelete(params.row.brandId)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  },
];

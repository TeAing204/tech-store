import { Box, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteIcon from "@mui/icons-material/Delete";

const STATUS_LABELS = {
  ACTIVE: "Hoạt động",
  INIT: "Khởi tạo",
  PAUSED: "Tạm dừng",
  UNKNOWN: "Không xác định",
};

export const getUserColumns = (softDeleteHandler) => [
  {
    field: "username",
    headerName: "NGƯỜI DÙNG",
    flex: 2,
    renderCell: (params) => {
      const avatarUrl =
        params.row.avatar ||
        params.row.avatarUrl ||
        "../../../default_avatar.jpg";
      const userId = params.row.userId;

      return (
        <Link
          to={`/admin/users/user/${userId}`}
          state={{ user: params.row }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box
            component="img"
            src={avatarUrl}
            alt={params.row.username}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <Typography
            sx={{
              fontWeight: 500,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {params.row.username}
          </Typography>
        </Link>
      );
    },
  },
  { field: "email", headerName: "EMAIL", flex: 2 },
  {
    field: "roles",
    headerName: "CHỨC VỤ",
    flex: 2,
    renderCell: (params) => {
      const roles = params.row.roles || [];
      if (roles.length === 0) return "—";

      const priority = [
        "ROLE_USER",
        "ROLE_SELLER",
        "ROLE_MANAGER",
        "ROLE_ADMIN",
      ];
      const sortedRoles = [...roles].sort(
        (a, b) => priority.indexOf(a.roleName) - priority.indexOf(b.roleName)
      );

      const highestRole = sortedRoles[sortedRoles.length - 1];
      return highestRole?.roleName?.replace("ROLE_", "");
    },
  },
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
        case "INIT":
          color = "#f59e0b";
          bg = "rgba(245,158,11,0.1)";
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
        <IconButton color="secondary" onClick={() => {}}>
          <EditSquareIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => softDeleteHandler(params.row.userId)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  },
];

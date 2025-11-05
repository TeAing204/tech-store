import { Box } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { deleteUser, restoreUser } from "../features/users/userSlice";
import useUserFilter from "../hooks/useUserFilter";
import Header from "../layouts/Header";
import ToolBarTrushUser from "../features/users/ToolBarTrushUser";
import IsLoading from "../components/spinner/IsLoading";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import Table from "../components/share/Table";
import ConfirmDialog from "../components/share/ConfirmDialog";
import { getUserTrashColumns } from "../features/users/useTrashColumn";

const TrashUsers = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const { trashUsers, isLoading, errorMessage, trashPagination } = useSelector(
    (state) => state.users
  );
  const dispatch = useDispatch();

  const openConfirm = useCallback((title, description, onConfirm) => {
    setConfirmData({ title, description, onConfirm });
    setConfirmOpen(true);
  }, []);
  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  const handleDeleteUser = useCallback(
    (userId) => {
      openConfirm("Xóa người dùng", "Xóa vĩnh viễn người dùng này?", async () => {
        try {
          await dispatch(deleteUser({ userIds: [userId] })).unwrap();
          toast.success("Đã xóa người dùng vĩnh viễn!");
        } catch {
          toast.error("Xóa thất bại, vui lòng thử lại!");
        } finally {
          closeConfirm();
        }
      });
    },
    [dispatch, openConfirm, closeConfirm]
  );

  const handleRestoreUser = useCallback(
    (userId) => {
      openConfirm("Khôi phục người dùng", "Bạn có chắc muốn khôi phục?", async () => {
        try {
          await dispatch(restoreUser({ userIds: [userId] })).unwrap();
          toast.success("Khôi phục thành công!");
        } catch {
          toast.error("Khôi phục thất bại!");
        } finally {
          closeConfirm();
        }
      });
    },
    [dispatch, openConfirm, closeConfirm]
  );

  const roleOptions = useMemo(() => {
    if (!trashUsers || trashUsers.length === 0) return [];
    const allRoles = trashUsers.flatMap((user) => user.roles || []);
    const uniqueRoles = Array.from(new Map(allRoles.map((r) => [r.roleId, r])).values());
    return uniqueRoles.map((r) => ({
      label: r.roleName.replace("ROLE_", "").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
      value: r.roleId,
    }));
  }, [trashUsers]);

  const columns = getUserTrashColumns(handleRestoreUser, handleDeleteUser);
  useUserFilter("trash");

  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <Header title="NHÂN SỰ" subtitle="Thùng rác nhân viên." />
        <ToolBarTrushUser roleOptions={roleOptions} selectedUserIds={selectedUserIds} />
        {isLoading ? (
          <IsLoading />
        ) : errorMessage ? (
          <div className="text-2xl flex flex-col items-center gap-5">
            <DoNotDisturbOnIcon sx={{ fontSize: 60 }} />
            {errorMessage?.message || errorMessage}
          </div>
        ) : (
          <Box sx={{ overflowX: "auto", width: "100%", minWidth: 0 }}>
            <Table
              isLoading={isLoading}
              data={trashUsers || []}
              columns={columns}
              onSelectionChange={(selection) => setSelectedUserIds(selection)}
              selectedIds={selectedUserIds}
              pagination={trashPagination}
            />
          </Box>
        )}
      </Box>

      <ConfirmDialog
        open={confirmOpen}
        title={confirmData.title}
        description={confirmData.description}
        onClose={closeConfirm}
        onConfirm={confirmData.onConfirm}
      />
    </div>
  );
};

export default TrashUsers;

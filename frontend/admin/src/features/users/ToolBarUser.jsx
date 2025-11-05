import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import useUserFilter from '../../hooks/useUserFilter';
import BulkActionBar from '../../components/action/BulkActionBar';
import { softDeleteUser, updateUserStatus } from './userSlice';
import TrashButton from '../../components/action/TrashButton';
import ActionButtons from '../../components/action/ActionButtons';
import SearchBar from '../../components/action/SearchBar';
import SelectFilter from '../../components/filter/SelectFilter';
import ClearButton from '../../components/action/ClearButton';

const ToolBarUser = ({ selectedUserIds, onClearSelection, setOpen, roleOptions }) => {
  const { users } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const statusOptions = useMemo(() => {
    if (!users || users.length === 0) return [];
    const statusLabelMap = {
      ACTIVE: "Hoạt động",
      INIT: "Khởi tạo",
      PAUSED: "Tạm dừng",
    };
    const allStatuses = users.map((u) => u.status).filter(Boolean);
    const uniqueStatuses = [...new Set(allStatuses)];

    return uniqueStatuses.map((status) => ({
      label: statusLabelMap[status] || status,
      value: status,
    }));
  }, [users]);

  useUserFilter();

  const handleBulkAction = async ({ action, selectedIds }) => {
    try {
      if (action === "softDelete") {
        await dispatch(softDeleteUser({ userIds: selectedIds })).unwrap();
        toast.success("Đã chuyển người dùng vào thùng rác!");
      } else {
        for (const userId of selectedIds) {
          await dispatch(updateUserStatus({ userId, status: action })).unwrap();
        }
        toast.success("Cập nhật trạng thái thành công!");
      }
      onClearSelection?.();
    } catch (err) {
      toast.error("Thao tác thất bại, vui lòng thử lại!");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex md:flex-row flex-col-reverse md:justify-between justify-center gap-4 my-7 overflow-hidden pt-2">
        <BulkActionBar
          selectedIds={selectedUserIds}
          actions={[
            { label: "Kích hoạt", value: "ACTIVE" },
            { label: "Khởi tạo", value: "INIT" },
            { label: "Tạm dừng", value: "PAUSED" },
            { label: "Xóa", value: "softDelete" },
          ]}
          onApply={handleBulkAction}
          label="Hành động"
        />
        <div className="flex gap-4">
          <TrashButton addLink="trash" />
          <ActionButtons setOpen={setOpen} />
        </div>
      </div>

      <div className="flex lg:flex-row flex-col lg:justify-between justify-start gap-4 overflow-hidden py-2">
        <SearchBar />
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex gap-4 items-center">
            <SelectFilter queryKey="role" label="Nhóm quyền" options={roleOptions} />
            <SelectFilter queryKey="status" label="Trạng thái" options={statusOptions} />
          </div>
          <ClearButton />
        </div>
      </div>
    </div>
  );
};

export default ToolBarUser;

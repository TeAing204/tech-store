import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { deleteUser, restoreUser } from './userSlice';
import BulkActionBar from '../../components/action/BulkActionBar';
import BackButton from '../../components/action/BackButton';
import SearchBar from '../../components/action/SearchBar';
import SelectFilter from '../../components/filter/SelectFilter';
import ClearButton from '../../components/action/ClearButton';

const ToolBarTrushUser = ({ selectedUserIds, roleOptions }) => {
  const dispatch = useDispatch();

  const handleApply = async ({ action, selectedIds }) => {
    try {
      if (action === "restore") {
        await dispatch(restoreUser({ userIds: selectedIds })).unwrap();
        toast.success("Khôi phục người dùng thành công!");
      } 
      else if (action === "delete") {
        await dispatch(deleteUser({ userIds: selectedIds })).unwrap();
        toast.success("Xóa vĩnh viễn người dùng thành công!");
      }
    } catch (err) {
      console.log("Lỗi: ", err);
      toast.error("Thao tác thất bại!");
    }
  };

  return (
    <div>
      <div className="flex md:flex-row flex-col-reverse md:justify-between justify-center gap-4 my-7 overflow-hidden pt-2">
        <BulkActionBar
          selectedIds={selectedUserIds}
          actions={[
            { label: "Khôi phục", value: "restore" },
            { label: "Xóa vĩnh viễn", value: "delete" },
          ]}
          onApply={handleApply}
        />
        <div className="flex gap-4">
          <BackButton addLink="/admin/users" />
        </div>
      </div>

      <div className="flex xl:flex-row flex-col xl:justify-between justify-center gap-4 my-7 overflow-hidden py-2">
        <SearchBar />
        <div className="flex sm:flex-row flex-col gap-4 items-start sm:items-center">
          <SelectFilter queryKey="role" label="Nhóm quyền" options={roleOptions} />
          <ClearButton />
        </div>
      </div>
    </div>
  );
};

export default ToolBarTrushUser;

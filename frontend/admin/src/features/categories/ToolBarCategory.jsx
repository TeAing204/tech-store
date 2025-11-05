import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useMemo } from "react";
import BulkActionBar from "../../components/action/BulkActionBar";
import { deleteCategory, updateCategoryStatus } from "./categorySlice";
import ActionButtons from "../../components/action/ActionButtons";
import SearchBar from "../../components/action/SearchBar";
import SelectFilter from "../../components/filter/SelectFilter";
import ClearButton from "../../components/action/ClearButton";

const ToolBarCategory = ({
  setOpen,
  onClearSelection,
  selectedCategoryIds,
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const statusOptions = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    const statusLabelMap = {
      ACTIVE: "Hoạt động",
      PAUSED: "Tạm dừng",
    };
    const allStatuses = categories.map((u) => u.status).filter(Boolean);
    const uniqueStatuses = [...new Set(allStatuses)];

    return uniqueStatuses.map((status) => ({
      label: statusLabelMap[status] || status,
      value: status,
    }));
  }, [categories]);
  return (
    <div>
      <div className="flex sm:flex-row flex-col-reverse sm:justify-between justify-center gap-4 my-7 overflow-hidden pt-2">
        <BulkActionBar
          selectedIds={selectedCategoryIds}
          actions={[
            { label: "Kích hoạt", value: "ACTIVE" },
            { label: "Tạm dừng", value: "PAUSED" },
            { label: "Xóa", value: "delete" },
          ]}
          onApply={async ({ action, selectedIds }) => {
            try {
              if (action === "delete") {
                await dispatch(
                  deleteCategory({ categoryIds: selectedIds })
                ).unwrap();
                toast.success("Đã xóa danh mục thành công!");
              } else {
                for (const categoryId of selectedIds) {
                  await dispatch(
                    updateCategoryStatus({ categoryId, status: action })
                  ).unwrap();
                }
                toast.success(
                  action === "ACTIVE"
                    ? "Đã kích hoạt danh mục!"
                    : "Đã tạm dừng danh mục!"
                );
              }
              onClearSelection?.();
            } catch (error) {
              console.log(error);
              toast.error("Thao tác thất bại, vui lòng thử lại!");
            }
          }}
          label="Hành động"
        />
        <ActionButtons setOpen={setOpen} />
      </div>
      <div className="flex md:flex-row flex-col md:justify-between justify-center gap-4 my-7 overflow-hidden py-2">
        <SearchBar />
        <div className="flex gap-4 items-center">
          <SelectFilter
            queryKey="status"
            label="Trạng thái"
            options={statusOptions}
          />
          <ClearButton />
        </div>
      </div>
    </div>
  );
};

export default ToolBarCategory;

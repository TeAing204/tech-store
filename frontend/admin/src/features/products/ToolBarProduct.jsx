

import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import BulkActionBar from "../../components/action/BulkActionBar";
import { softDeleteProduct, updateProductStatus } from "./productSlice";
import TrashButton from "../../components/action/TrashButton";
import ActionButtons from "../../components/action/ActionButtons";
import SearchBar from "../../components/action/SearchBar";
import SelectFilter from "../../components/filter/SelectFilter";
import SortButton from "../../components/filter/SortButton";
import ClearButton from "../../components/action/ClearButton";

const ToolBarProduct = ({ categories, brands, selectedProductIds, onClearSelection }) => {
  const categoryOptions = categories.map((c) => ({
    value: c.categoryId,
    label: c.categoryName,
  }));
  const brandOptions = brands.map((c) => ({
    value: c.brandId,
    label: c.brandName,
  }));
  const dispatch = useDispatch();
  return (
    <div>
      <div className="flex md:flex-row flex-col md:justify-between justify-center gap-4 mt-7 mb-2 md:mb-6 overflow-hidden pt-2">
        <BulkActionBar
          selectedIds={selectedProductIds}
          actions={[
            { label: "Kích hoạt", value: "ACTIVE" },
            { label: "Tạm dừng", value: "PAUSED" },
            { label: "Xóa", value: "softDelete" },
          ]}
          onApply={async ({ action, selectedIds }) => {
            if (!selectedIds?.length) {
              toast.error("Chưa chọn sản phẩm nào");
              return;
            }
            if (action === "softDelete") {
              const result = await dispatch(softDeleteProduct({productIds: selectedIds}));
              if(softDeleteProduct.fulfilled.match(result)){
                toast.success("Các sản phẩm đã được chuyển vào thùng rác!");
              } else {
                toast.error("Xóa sản phẩm thất bại!");
              }
            } else {
              const isActive = action === "ACTIVE";
              for (const productId of selectedIds) {
                const resulte = await dispatch(updateProductStatus({ productId, isActive }));
                if(updateProductStatus.fulfilled.match(resulte)){
                  toast.success("Cập nhật trạng thái thành công!");
                } else {
                  toast.error("Cập nhật trạng thái thất bại!");
                }
              }
            }
            onClearSelection?.();
          }}
          label="Hành động"
        />
        <div className="flex sm:gap-4 gap-2">
          <TrashButton addLink="/admin/products/trash" />
          <ActionButtons addLink="add"/>
        </div>
      </div>
      <div className="flex xl:flex-row flex-col-reverse xl:justify-between justify-center gap-4 overflow-hidden py-2">
        <SearchBar />
        <div className="flex sm:flex-row flex-col gap-4 items-start justify-between sm:items-center">
          <div className="flex items-center sm:gap-x-4 gap-x-2">
            <SelectFilter
              queryKey="category"
              label="Danh mục"
              options={categoryOptions}
            />
            <SelectFilter
              queryKey="brand"
              label="Thương hiệu"
              options={brandOptions}
            />
          </div>
          <div className="flex items-center sm:gap-x-4 gap-x-2">
            <SortButton />
            <ClearButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolBarProduct;

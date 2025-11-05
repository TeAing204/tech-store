import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import BulkActionBar from "../../components/action/BulkActionBar";
import { deleteProduct, restoreProduct } from "./productSlice";
import BackButton from "../../components/action/BackButton";
import SearchBar from "../../components/action/SearchBar";
import SelectFilter from "../../components/filter/SelectFilter";
import SortButton from "../../components/filter/SortButton";
import ClearButton from "../../components/action/ClearButton";

const ToolBarTrashProduct = ({ categories, brands, selectedProductIds, onClearSelection }) => {
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
      <div className="flex md:flex-row flex-col-reverse md:justify-between justify-center gap-4 my-7 overflow-hidden pt-2">
        <BulkActionBar
          selectedIds={selectedProductIds}
          actions={[
            { label: "Khôi phục", value: "restore" },
            { label: "Xóa vĩnh viễn", value: "delete" },
          ]}
          onApply={async ({ action, selectedIds }) => {
            if (!selectedIds?.length) {
              toast.error("Chưa chọn sản phẩm nào");
              return;
            }
            if (action === "restore") {
              const result = await dispatch(restoreProduct({productIds: selectedIds}));
              if(restoreProduct.fulfilled.match(result)){
                toast.success("Sản phẩm đã được khôi phục!");
              } else {
                toast.error("Khôi phục sản phẩm thất bại!");
              }
            } else {
              const result = await dispatch(deleteProduct({productIds: selectedIds}));
              if(deleteProduct.fulfilled.match(result)){
                toast.success("Sản phẩm đã bị xóa vĩnh viễn!");
              } else {
                toast.error("Xóa sản phẩm thất bại!");
              }
            }
            onClearSelection?.();
          }}
          label="Hành động"
        />
        <div className="flex gap-4">
          <BackButton addLink="/admin/products"/>
        </div>
      </div>
      <div className="flex xl:flex-row flex-col-reverse xl:justify-between justify-center gap-4 my-7 overflow-hidden py-2">
        <SearchBar />
        <div className="flex sm:flex-row flex-col gap-4 items-start sm:items-center">
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
          <SortButton />
          <ClearButton />
        </div>
      </div>
    </div>
  );
};

export default ToolBarTrashProduct;

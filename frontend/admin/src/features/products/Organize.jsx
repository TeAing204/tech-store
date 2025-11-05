import { Box } from "@mui/material";
import { memo } from "react";
import SelectForm from "../../components/form/SelectForm";
import { useFetchOptions } from "../../hooks/useFetchOptions";

const Organize = memo(({ control }) => {
  const { categories, brands } = useFetchOptions();

  return (
    <Box sx={{ padding: 2 }}>
      <div className="space-y-4 pb-4">
        <label className="text-lg font-semibold">Tổ chức</label>

        <SelectForm
          name="categoryId"
          title="Danh mục"
          action="Thêm danh mục"
          linkAction="/admin/categories"
          control={control}
          options={categories} 
          valueKey="categoryId"
          labelKey="categoryName"
        />

        <SelectForm
          name="brandId"
          title="Thương hiệu"
          action="Thêm thương hiệu"
          linkAction="/admin/brands"
          control={control}
          options={brands} 
          valueKey="brandId"
          labelKey="brandName"
        />
      </div>
    </Box>
  );
});

export default Organize;




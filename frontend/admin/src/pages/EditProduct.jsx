import { Box } from "@mui/material";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../layouts/Header";
import AddProductAct from "../features/products/AddProductAct";
import ProductForm from "../features/products/ProductForm";

const EditProduct = () => {
  const resetFormRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  if (!product) {
    navigate("/admin/products");
    return null;
  }
  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <div className="flex sm:justify-between flex-col sm:flex-row gap-y-5">
          <Header title="CHỈNH SỬA SẢN PHẨM" subtitle="Chỉnh sửa sản phẩm." />
          <AddProductAct mode="edit" onReset={() => resetFormRef.current?.()} />
        </div>
        <ProductForm
          onResetRef={(resetFunc) => (resetFormRef.current = resetFunc)}
          mode="edit"
          editProduct={product}
        />
      </Box>
    </div>
  );
};

export default EditProduct;

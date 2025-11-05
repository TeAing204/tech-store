import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import WarningIcon from "@mui/icons-material/Warning";
import { fetchCategories } from "../features/categories/categorySlice";
import { fetchBrands } from "../features/brands/brandSlice";
import useProductFilter from "../hooks/useProductFilter";
import IsLoading from "../components/spinner/IsLoading";
import ProductCard from "../features/products/ProductCard";
import Paginations from "../components/share/Paginations";
import Header from "../layouts/Header";
import ToolBarTrashProduct from "../features/products/ToolBarTrashProduct";

const TrashProducts = memo(() => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const theme = useTheme();
  const dispatch = useDispatch();

  const { trashProducts, isLoading, pagination, errorMessage } = useSelector(
    (state) => state.products,
    shallowEqual
  );
  const { categories, isLoading: catLoading } = useSelector(
    (state) => state.categories,
    shallowEqual
  );
  const { brands, isLoading: brLoading } = useSelector(
    (state) => state.brands,
    shallowEqual
  );
  useEffect(() => {
    if (!categories?.length) {
      dispatch(fetchCategories());
    }
    if (!brands?.length) {
      dispatch(fetchBrands());
    }
  }, [dispatch, categories?.length, brands?.length]);
  const handleSelectProduct = useCallback((productId, isChecked) => {
    setSelectedProductIds((prev) =>
      isChecked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedProductIds([]);
  }, []);
  useProductFilter("trash");

  const renderContent = useMemo(() => {
    if (isLoading || catLoading || brLoading) return (
      <IsLoading/>
    )

    if (errorMessage)
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height={200}
        >
          <WarningIcon sx={{fontSize: 70}} />
          <Typography
            color={theme.palette.secondary.main}
            fontWeight={500}
            fontSize="1.125rem"
          >
            {errorMessage?.message || errorMessage}
          </Typography>
        </Box>
      );

    if (!trashProducts?.length)
      return (
        <Typography textAlign="center" mt={4} color={theme.palette.text.secondary}>
          <WarningIcon sx={{fontSize: 70}} />
          Không có sản phẩm nào.
        </Typography>
      );

    return (
      <>
        <Box
          my="20px"
          display="grid"
          gap="20px"
          sx={{
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
          }}
        >
          {trashProducts.map((item) => (
            <ProductCard isTrash key={item.productId} {...item} onSelect={handleSelectProduct} isSelected={selectedProductIds.includes(item.productId)}/>
          ))}
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Paginations numberOfPage={pagination.totalPages} />
        </Box>
      </>
    );
  }, [isLoading, catLoading, trashProducts, pagination, errorMessage, theme, handleSelectProduct, selectedProductIds]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="SẢN PHẨM" subtitle="Thùng rác sản phẩm." />
      <ToolBarTrashProduct categories={categories ?? []} brands={brands ?? []} selectedProductIds={selectedProductIds} onClearSelection={clearSelection}/>
      {renderContent}
    </Box>
  );
});

export default TrashProducts;

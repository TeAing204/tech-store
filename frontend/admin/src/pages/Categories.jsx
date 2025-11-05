import { Box, Button, Drawer, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "../features/categories/categorySlice";
import useCategoryFilter from "../hooks/useCategoryFilter";
import Header from "../layouts/Header";
import ToolBarCategory from "../features/categories/ToolBarCategory";
import Table from "../components/share/Table";
import IsLoading from "../components/spinner/IsLoading";
import InputField from "../components/form/InputField";
import ConfirmDialog from "../components/share/ConfirmDialog";
import { getCategoryColumns } from "../features/categories/categoryData";
import FlexBetween from "../components/share/FlexBetween";
dayjs.locale("vi");

const Categories = () => {
  const { categories, isLoading, pagination } = useSelector(
    (state) => state.categories
  );
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const theme = useTheme();
  const dispatch = useDispatch();
  const clearSelectedCategories = () => setSelectedCategoryIds([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      categoryName: "",
      description: "",
    },
  });
  const onSubmit = (data) => {
    const { categoryName, description } = data;
    if (editingCategory) {
      dispatch(
        updateCategory({
          categoryId: editingCategory.categoryId,
          categories: { categoryName, description },
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Cập nhật danh mục thành công!");
        })
        .catch(() => {
          toast.error("Cập nhật danh mục thất bại!");
        });
    } else {
      dispatch(
        addCategory({
          categoryName,
          description,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Thêm danh mục thành công!");
        })
        .catch(() => {
          toast.error("Thêm danh mục thất bại!");
        });
    }
    reset();
    setEditingCategory(null);
    setOpen(false);
  };

  const openConfirm = (title, description, onConfirm) => {
    setConfirmData({ title, description, onConfirm });
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmData({});
  };
  const handleDelete = useCallback(
    (categoryId) => {
      openConfirm(
        "Xóa danh mục",
        "Bạn có chắc chắn muốn xóa vĩnh viễn?",
        () => {
          dispatch(deleteCategory({ categoryIds: [categoryId] }))
            .unwrap()
            .then(() => {
              toast.success("Xóa danh mục thành công!");
            })
            .catch(() => {
              toast.error("Xóa danh mục thất bại!");
            });
          closeConfirm();
        }
      );
    },
    [dispatch, openConfirm, closeConfirm]
  );

  const handleEdit = (row) => {
    setEditingCategory(row);
    reset({
      categoryName: row.categoryName,
      description: row.description,
    });
    setOpen(true);
  };
  const columns = getCategoryColumns(handleEdit, handleDelete);
  useCategoryFilter();
  return (
    <div>
      <Box sx={{
        m: {
          xs: "1rem 1.5rem", 
          md: "1.5rem 2.5rem", 
        },
      }}>
        <Header title="DANH MỤC" subtitle="Quản lý danh mục." />
        <ToolBarCategory
          selectedCategoryIds={selectedCategoryIds}
          onClearSelection={clearSelectedCategories}
          setOpen={() => {
            setEditingCategory(null);
            reset({
              categoryName: "",
              description: "",
            });
            setOpen(true);
          }}
        />
        {!isLoading ? (
          <div>
            <Table
              isLoading={isLoading}
              data={categories || []}
              columns={columns}
              onSelectionChange={(selection) =>
                setSelectedCategoryIds(selection)
              }
              selectedIds={selectedCategoryIds}
              pagination={pagination}
            />
          </div>
        ) : (
          <div>
            <IsLoading />
          </div>
        )}
      </Box>
      <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
        <Box
          bgcolor={theme.palette.background.alt}
          sx={{
            width: "400px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 3,
          }}
        >
          {/* Header */}
          <FlexBetween>
            <div className="text-xl">
              {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
            </div>
            <button className="cursor-pointer" onClick={() => setOpen(false)}>
              <CloseIcon />
            </button>
          </FlexBetween>

          <Box sx={{ mt: 4, flex: 1 }}>
            <form id="category-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                label="Tên danh mục"
                required
                id="categoryName"
                type="text"
                message="Tên danh mục không được để trống"
                placeholder="Tên danh mục"
                register={register}
                errors={errors}
              />
              <InputField
                label="Mô tả"
                id="description"
                type="text"
                placeholder="Viết mô tả"
                register={register}
                errors={errors}
              />
            </form>
          </Box>

          {/* Footer */}
          <Button
            onClick={handleSubmit}
            type="submit"
            form="category-form"
            variant="contained"
            sx={{ py: "8px", fontSize: "16px", mt: 3 }}
            color="secondary"
          >
            {editingCategory ? "Cập nhật" : "Thêm vào"}
          </Button>
        </Box>
      </Drawer>
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

export default Categories;

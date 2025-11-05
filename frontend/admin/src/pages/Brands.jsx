import { Box, Button, Drawer, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {
  addBrand,
  deleteBrand,
  updateBrand,
} from "../features/brands/brandSlice";
import useBrandFilter from "../hooks/useBrandFilter";
import Header from "../layouts/Header";
import ToolBarBrand from "../features/brands/ToolBarBrand";
import Table from "../components/share/Table";
import IsLoading from "../components/spinner/IsLoading";
import InputField from "../components/form/InputField";
import ConfirmDialog from "../components/share/ConfirmDialog";
import { getBrandColumns } from "../features/brands/brandData";
import FlexBetween from "../components/share/FlexBetween";
dayjs.locale("vi");

const Brands = () => {
  const { brands, isLoading, pagination } = useSelector(
    (state) => state.brands
  );
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});
  const [editingBrand, setEditingBrand] = useState(null);
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);
  const theme = useTheme();
  const dispatch = useDispatch();
  const clearSelectedBrands = () => setSelectedBrandIds([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      brandName: "",
      description: "",
    },
  });
  const onSubmit = (data) => {
    const { brandName, description } = data;
    if (editingBrand) {
      dispatch(
        updateBrand({
          brandId: editingBrand.brandId,
          brands: { brandName, description },
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Cập nhật thương hiệu thành công!");
        })
        .catch(() => {
          toast.error("Cập nhật thương hiệu thất bại!");
        });
    } else {
      dispatch(
        addBrand({
          brandName,
          description,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Thêm thương hiệu thành công!");
        })
        .catch(() => {
          toast.error("Thêm thương hiệu thất bại!");
        });
    }
    reset();
    setEditingBrand(null);
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
    (brandId) => {
      openConfirm(
        "Xóa thương hiệu",
        "Bạn có chắc chắn muốn xóa vĩnh viễn?",
        () => {
          dispatch(deleteBrand({ brandIds: [brandId] }))
            .unwrap()
            .then(() => {
              toast.success("Xóa thương hiệu thành công!");
            })
            .catch(() => {
              toast.error("Xóa thương hiệu thất bại!");
            });
          closeConfirm();
        }
      );
    },
    [dispatch, openConfirm, closeConfirm]
  );

  const handleEdit = (row) => {
    setEditingBrand(row);
    reset({
      brandName: row.brandName,
      description: row.description,
    });
    setOpen(true);
  };
  const columns = getBrandColumns(handleEdit, handleDelete);
  useBrandFilter();
  return (
    <div>
      <Box sx={{
        m: {
          xs: "1rem 1.5rem", 
          md: "1.5rem 2.5rem", 
        },
      }}>
        <Header title="THƯƠNG HIỆU" subtitle="Quản lý thương hiệu." />
        <ToolBarBrand
          selectedBrandIds={selectedBrandIds}
          onClearSelection={clearSelectedBrands}
          setOpen={() => {
            setEditingBrand(null);
            reset({
              brandName: "",
              description: "",
            });
            setOpen(true);
          }}
        />
        {!isLoading ? (
          <div>
            <Table
              isLoading={isLoading}
              data={brands || []}
              columns={columns}
              onSelectionChange={(selection) =>
                setSelectedBrandIds(selection)
              }
              selectedIds={selectedBrandIds}
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
              {editingBrand ? "Sửa thương hiệu" : "Thêm thương hiệu"}
            </div>
            <button className="cursor-pointer" onClick={() => setOpen(false)}>
              <CloseIcon />
            </button>
          </FlexBetween>

          <Box sx={{ mt: 4, flex: 1 }}>
            <form id="brand-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                label="Tên thương hiệu"
                required
                id="brandName"
                type="text"
                message="Tên thương hiệu không được để trống"
                placeholder="Tên thương hiệu"
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
            form="brand-form"
            variant="contained"
            sx={{ py: "8px", fontSize: "16px", mt: 3 }}
            color="secondary"
          >
            {editingBrand ? "Cập nhật" : "Thêm vào"}
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

export default Brands;

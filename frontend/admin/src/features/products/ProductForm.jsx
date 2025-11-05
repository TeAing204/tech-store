import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addProduct, updateProduct } from "./productSlice";
import ImageUpload from "./ImageUpload";
import Organize from "./Organize";
import CustomTabButton from "./CustomTabButton";
import { Editor } from "@tinymce/tinymce-react";

const ProductForm = ({ onResetRef, mode = "create", editProduct }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      productName: "",
      description: "",
      price: "",
      discount: "",
      quantity: "",
      brandId: "",
      categoryId: "",
      images: [],
    },
  });

  useEffect(() => {
    if (onResetRef) onResetRef(() => reset());
  }, [onResetRef, reset]);

  useEffect(() => {
    if (mode === "edit" && editProduct) {
      reset({
        productName: editProduct.productName || "",
        description: editProduct.description || "",
        price: editProduct.price || "",
        discount: editProduct.discount || "",
        quantity: editProduct.quantity || "",
        brandId: editProduct.brandDTO?.brandId || "",
        categoryId: editProduct.categoryDTO?.categoryId || "",
        images: editProduct.images || [],
      });
    }
  }, [mode, editProduct, reset]);

  const onSubmit = (data) => {
    const {
      productName,
      description,
      price,
      discount,
      quantity,
      brandId,
      categoryId,
      images,
    } = data;
    const product = {
      productName,
      description,
      price,
      discount,
      quantity,
      brandId,
      categoryId
    };
    if (mode === "create") {
      dispatch(addProduct({ product, images, categoryId }))
        .unwrap()
        .then(() => {
          toast.success("Thêm sản phẩm thành công!");
          reset();
        })
        .catch((err) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Thêm sản phẩm thất bại";
          toast.error(message);
        });
    } else if (mode === "edit") {
      dispatch(
        updateProduct({ productId: editProduct.productId, product, images })
      )
        .unwrap()
        .then(() => {
          toast.success("Cập nhật sản phẩm thành công!");
          navigate("/admin/products");
        })
        .catch((err) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Cập nhật sản phẩm thất bại";
          toast.error(message);
        });
    }
  };

  const inputStyle = {
    mt: 3,
    width: "100%",
    resize: "none",
    borderRadius: "8px",
    p: "10px 12px",
    border: "1px solid",
    borderColor: theme.palette.border.main,
    fontSize: "14px",
    lineHeight: "1.5",
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
    "&::placeholder": { color: theme.palette.text.secondary, opacity: 1 },
    "&:focus": { outline: "2px solid #d0e2ff", borderColor: "#4a90e2" },
  };

  return (
    <form id="add-product-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          {/* Tên sản phẩm */}
          <div>
            <label className="text-xl font-semibold">Tên sản phẩm</label>
            <Box
              component="input"
              placeholder="Tên sản phẩm"
              {...register("productName", {
                required: "Tên sản phẩm là bắt buộc",
              })}
              sx={inputStyle}
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="text-xl font-semibold">Mô tả sản phẩm</label>
            <Box
              component="textarea"
              placeholder="Viết mô tả sản phẩm ở đây"
              rows={5}
              {...register("description", { required: "Mô tả là bắt buộc" })}
              sx={inputStyle}
            />
            {/* <div className="mt-6">
              <Controller
                name="description"
                control={control}
                rules={{ required: "Mô tả là bắt buộc" }}
                render={({ field }) => (
                  <Editor
                    key={theme.palette.mode}
                    apiKey="c8mk36m95jj58lq6d3p4bgupv1uux4nfgkbpf7aglkzro3om"
                    value={field.value}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      plugins:
                        "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                      toolbar:
                        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                      branding: false,
                      skin:
                        theme.palette.mode === "dark" ? "oxide-dark" : "oxide",
                      content_css:
                        theme.palette.mode === "dark" ? "dark" : "default",
                        
                    }}
                  />
                )}
              />
            </div> */}
          </div>

          {/* Ảnh */}
          <div>
            <label className="text-xl font-semibold">Hình ảnh</label>
            <Controller
              name="images"
              control={control}
              rules={{ required: "Vui lòng chọn ít nhất 1 ảnh" }}
              render={({ field, fieldState }) => (
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error}
                />
              )}
            />
          </div>

          {/* Thanh toán */}
          <div>
            <label className="text-xl font-semibold">Thanh toán</label>
            <CustomTabButton register={register} errors={errors} />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4">
          <Box bgcolor={theme.palette.background.alt} sx={{ borderRadius: 2 }}>
            <Organize control={control} />
          </Box>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;

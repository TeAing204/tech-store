import { useState, useCallback, useMemo, memo } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Rating,
  Typography,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  restoreProduct,
  softDeleteProduct,
} from "./productSlice";
import ConfirmDialog from "../../components/share/ConfirmDialog";
import FlexBetween from "../../components/share/FlexBetween";

const ProductCard = memo(
  ({
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
    categoryDTO,
    brandDTO,
    active,
    images,
    onSelect,
    isSelected,
    isTrash,
  }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmData, setConfirmData] = useState({});

    const openMenu = useCallback((e) => setAnchorEl(e.currentTarget), []);
    const closeMenu = useCallback(() => setAnchorEl(null), []);
    const openConfirm = useCallback((title, description, onConfirm) => {
      setConfirmData({ title, description, onConfirm });
      setConfirmOpen(true);
    }, []);
    const closeConfirm = useCallback(() => setConfirmOpen(false), []);
    let color = "";
    let bg = "";
    if (active) {
      color = "#16a34a";
      bg = "rgba(22,163,74,0.1)";
    } else {
      color = "#dc2626";
      bg = "rgba(220,38,38,0.1)";
    }

    const handleEdit = useCallback(() => {
      closeMenu();
      navigate(`/admin/products/edit/${productId}`, {
        state: {
          product: {
            productId,
            productName,
            image,
            description,
            quantity,
            price,
            discount,
            specialPrice,
            categoryDTO,
            brandDTO,
            active,
            images,
          },
        },
      });
    }, [
      navigate,
      closeMenu,
      productId,
      productName,
      image,
      description,
      quantity,
      price,
      discount,
      specialPrice,
      categoryDTO,
      brandDTO,
      active,
      images,
    ]);

    const handleSoftDelete = useCallback(() => {
      openConfirm(
        "Xóa sản phẩm",
        "Bạn có chắc chắn muốn xóa sản phẩm này?",
        async () => {
          closeMenu();
          try {
            await dispatch(
              softDeleteProduct({ productIds: productId })
            ).unwrap();
            toast.success("Sản phẩm đã được chuyển vào thùng rác!");
          } catch (err) {
            console.error("Lỗi: ", err);
            toast.error("Xóa sản phẩm thất bại!");
          } finally {
            closeConfirm();
          }
        }
      );
    }, [dispatch, productId, openConfirm, closeConfirm, closeMenu]);

    const handleDelete = useCallback(() => {
      openConfirm("Xóa sản phẩm", "Sản phẩm sẽ bị xóa vĩnh viễn?", async () => {
        closeMenu();
        try {
          await dispatch(deleteProduct({ productIds: productId })).unwrap();
          toast.success("Sản phẩm đã được xóa vĩnh viễn!");
        } catch (error) {
          console.error("Lỗi :", error);
          toast.error("Xóa sản phẩm thất bại!");
        } finally {
          closeConfirm();
        }
      });
    }, [dispatch, productId, openConfirm, closeConfirm, closeMenu]);
    const handleRestore = useCallback(() => {
      openConfirm(
        "Khôi phục sản phẩm",
        "Sản phẩm sẽ được khôi phục?",
        async () => {
          closeMenu();
          try {
            await dispatch(restoreProduct({ productIds: productId })).unwrap();
            toast.success("Sản phẩm đã được khôi phục!");
          } catch (error) {
            console.error("Lỗi: ", error);
            toast.error("Khôi phục sản phẩm thất bại!");
          } finally {
            closeConfirm();
          }
        }
      );
    }, [dispatch, productId, openConfirm, closeConfirm, closeMenu]);

    const discountBadge = useMemo(
      () =>
        discount > 0 && (
          <Box
            backgroundColor={theme.palette.secondary[600]}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            -{discount}%
          </Box>
        ),
      [discount, theme]
    );

    return (
      <>
        <Card
          sx={{
            backgroundImage: "none",
            backgroundColor: theme.palette.background.alt,
            borderRadius: "0.55rem",
            boxShadow: "none",
          }}
        >
          <CardContent>
            <FlexBetween>
              <Typography
                sx={{ fontSize: 14 }}
                color={theme.palette.secondary[200]}
                gutterBottom
              >
                {categoryDTO?.categoryName}
              </Typography>
              <div>
                <IconButton onClick={openMenu}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  {isTrash ? (
                    <div>
                      <MenuItem onClick={handleRestore}>Khôi phục</MenuItem>
                      <MenuItem onClick={handleDelete}>Xóa</MenuItem>
                    </div>
                  ) : (
                    <div>
                      <MenuItem onClick={handleEdit}>Sửa</MenuItem>
                      <MenuItem onClick={handleSoftDelete}>Xóa</MenuItem>
                    </div>
                  )}
                </Menu>
              </div>
            </FlexBetween>

            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                height="160"
                image={image}
                alt={productName}
                sx={{
                  objectFit: "contain",
                  borderRadius: "8px",
                  margin: "1rem 0",
                }}
              />
              {discountBadge}
            </Box>
            <Typography
              sx={{
                display: "inline-flex",
                border: `1px solid ${color}`,
                color,
                backgroundColor: bg,
                borderRadius: "4px",
                fontWeight: 600,
                fontSize: "0.875rem",
                textAlign: "center",
                lineHeight: 1.4,
                px: 1.5,
                py: 0.3,
                mb: 1.2,
              }}
            >
              {active ? "Hoạt động" : "Tạm ẩn"}
            </Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {productName}
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.secondary[100]}
              sx={{ textDecoration: "line-through" }}
            >
              {price.toLocaleString("vi-VN")} VNĐ
            </Typography>
            <Typography color={theme.palette.secondary[300]}>
              {specialPrice.toLocaleString("vi-VN")} VNĐ
            </Typography>
          </CardContent>

          <CardActions sx={{pt: 0}}>
            <FlexBetween sx={{ width: "100%" }}>
              <Button
                color={theme.palette.text.primary}
                size="small"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                CHI TIẾT
              </Button>
              <Checkbox
                color="secondary"
                checked={isSelected}
                onChange={(e) => onSelect(productId, e.target.checked)}
              />
            </FlexBetween>
          </CardActions>

          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <CardContent sx={{ color: theme.palette.neutral[300], pt: 0 }}>
              <Rating value="Đánh giá" readOnly />
              <Typography variant="body2">ID: {productId}</Typography>
              <Typography variant="body2">
                Thương hiệu: {brandDTO?.brandName}
              </Typography>
              <Typography variant="body2">Số lượng: {quantity}</Typography>
              <Typography variant="body2">{description}</Typography>
            </CardContent>
          </Collapse>
        </Card>

        <ConfirmDialog
          open={confirmOpen}
          title={confirmData.title}
          description={confirmData.description}
          onClose={closeConfirm}
          onConfirm={confirmData.onConfirm}
        />
      </>
    );
  }
);

export default ProductCard;

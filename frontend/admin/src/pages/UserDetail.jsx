import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/users/userSlice";
import Header from "../layouts/Header";
import BackButton from "../components/action/BackButton";
import PasswordInput from "../features/users/PasswordInput";
import InputField from "../components/form/InputField";
const UserDetail = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const userFromState = location.state?.user;
  const { userId } = userFromState || {};
  const user = useSelector((state) =>
    state.users.users.find((u) => u.userId === userId)
  );
  const handleClickOpen = () => {
    setOpen(true);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      username: user.username,
      email: user.email,
      status: user.status,
      sdt: user.phoneNumber,
      buildingName: user.addresses?.[0]?.buildingName,
      street: user.addresses?.[0]?.street,
      country: user.addresses?.[0]?.country,
    },
  });
  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data) => {
    const userPayload = {
      username: data.username,
      email: data.email,
      phoneNumber: data.sdt,
      status: data.status,
    };

    try {
      await dispatch(
        updateUser({ userId: user.userId, user: userPayload })
      ).unwrap();
      toast.success("Cập nhật người dùng thành công!");
      handleClose();
    } catch (err) {
      console.log("Lỗi: ", err);
      toast.error("Cập nhật người dùng thất bại!");
    }
  };

  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <div className="flex justify-between items-end">
          <Header title="NGƯỜI DÙNG" subtitle="Chi tiết người dùng." />
          <BackButton addLink="/admin/users" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
          <Box
            className="lg:col-span-4 rounded-lg"
            sx={{
              backgroundColor: theme.palette.background.alt,
            }}
          >
            <div className="flex flex-col justify-center items-center">
              <Avatar
                variant="rounded"
                sx={{ width: "120px", height: "120px", mt: 6 }}
              ></Avatar>
              <span className="text-xl font-medium my-4">{user.username}</span>
              <span className="border border-[#16a34a] text-[#16a34a] bg-[rgba(22,163,74,0.1)] px-2 py-0.5 rounded-md">
                {user?.roles?.map((r) =>
                  r.roleName
                    .replace("ROLE_", "")
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase())
                )}
              </span>
            </div>
            <div className="p-6 flex flex-col space-y-2">
              <span className="text-xl font-medium">Chi tiết</span>
              <hr className="opacity-20 my-4" />
              <span>
                <strong>Tên:</strong> {user.username}
              </span>
              <span>
                <strong>Email:</strong> {user.email}
              </span>
              <span>
                <strong>Trạng thái:</strong>{" "}
                {user.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
              </span>
              <span>
                <strong>Quyền:</strong>{" "}
                {user?.roles?.map((r) =>
                  r.roleName
                    .replace("ROLE_", "")
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase())
                )}
              </span>
              <span>
                <strong>Liên hệ:</strong> {user.phoneNumber || ""}
              </span>
            </div>
            <div className="flex justify-center mb-8 gap-x-3">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
              >
                Chỉnh sửa
              </Button>
              <Button variant="outlined" color="error">
                Tạm dừng
              </Button>
            </div>
          </Box>
          <Box className="lg:col-span-8 space-y-8">
            <Box
              className="p-6 rounded-lg"
              sx={{
                backgroundColor: theme.palette.background.alt,
              }}
            >
              <span className="text-lg font-medium">Thay đổi mật khẩu</span>
              <Alert
                variant="outlined"
                severity="warning"
                className="my-5"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <div className="text-lg font-medium">
                  Đảm bảo rằng các yêu cầu này được đáp ứng
                </div>
                <div className="text-sm">
                  Tối thiểu 5 ký tự, viết hoa và ký hiệu
                </div>
              </Alert>
              <div className="mb-1">
                <div className="flex justify-between flex-col md:flex-row gap-x-4">
                  <PasswordInput
                    label="Mật khẩu mới"
                    placeholder="Mật khẩu mới"
                  />
                  <PasswordInput
                    label="Xác nhận mật khẩu"
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </div>
              </div>
              <Button size="large" variant="contained" color="secondary">
                Thay đổi mật khẩu
              </Button>
            </Box>
          </Box>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          slotProps={{
            paper: {
              sx: {
                width: {
                  xs: "90%",
                  sm: "80%",
                  md: "600px",
                  lg: "800px",
                },
                maxWidth: "none",
                p: "20px",
              },
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{ fontSize: "24px", textAlign: "center" }}
          >
            {"Chỉnh sửa thông tin người dùng"}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <div className="flex flex-col md:flex-row gap-4 my-4 md:justify-between md:items-center">
                <div className="w-full md:w-1/2">
                  <InputField
                    label="Tên người dùng"
                    required
                    id="username"
                    type="text"
                    message="Tên người dùng không được để trống"
                    placeholder="Tên người dùng"
                    register={register}
                    errors={errors}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <InputField
                    label="Email"
                    required
                    id="email"
                    type="email"
                    message="Email không được để trống"
                    placeholder="Email"
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:justify-between items-center">
                <div className="w-full md:w-1/2">
                  <InputLabel
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Trạng thái
                  </InputLabel>
                  <Select
                    id="status"
                    size="small"
                    fullWidth
                    sx={{ mt: "7px", py: "1px" }}
                    defaultValue={user.status}
                    {...register("status")}
                  >
                    <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                    <MenuItem value="INIT">Khởi tạo</MenuItem>
                    <MenuItem value="PAUSED">Tạm ngưng</MenuItem>
                  </Select>
                </div>
                <div className="w-full md:w-1/2">
                  <InputField
                    label="Số điện thoại"
                    required
                    id="sdt"
                    type="text"
                    message="Số điện thoại không được để trống"
                    placeholder="Số điện thoại"
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions sx={{ px: "24px" }}>
              <Button onClick={handleClose} variant="outlined" color="error">
                Hủy bỏ
              </Button>
              <Button type="submit" variant="contained" color="secondary">
                Thay đổi
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </div>
  );
};

export default UserDetail;

import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import InputField from "../components/form/InputField";
import { useEffect, useState } from "react";
import PasswordInput from "../features/users/PasswordInput";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetail,
  updateAccount,
  updateAccountImage,
  updatePassword,
} from "../features/auth/authSlice";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ flex: 1, paddingTop: 16 }}
    >
      {value === index && children}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
const Account = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [checked, setChecked] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
  };
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });
  useEffect(() => {
    dispatch(getUserDetail());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      reset({
        userId: user.userId,
        username: user.username,
        email: user.email,
        sdt: user.phoneNumber,
        role: user.roles,
      });
    }
  }, [user, reset]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleDelete = () => {
    if (!checked) return;
    // Thực hiện xóa tài khoản ở đây
    console.log("Tài khoản đã bị xóa");
  };
  const onSubmit = async (data) => {
    const userPayload = {
      username: data.username,
      email: data.email,
      phoneNumber: data.sdt,
    };

    try {
      await dispatch(updateAccount(userPayload)).unwrap();
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      console.log("Lỗi: ", err);
      toast.error("Cập nhật thông tin thất bại!");
    }
  };
  const handleUploadAvatar = async () => {
    if (!selectedAvatar) return toast.error("Vui lòng chọn ảnh!");
    try {
      await dispatch(updateAccountImage(selectedAvatar)).unwrap();
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.log("Lỗi: ", err);
      toast.error("Cập nhật ảnh đại diện thất bại!");
    }
  };
  const onSubmitPassword = async (formData) => {
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp!");
    }

    const payload = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    };

    try {
      await dispatch(updatePassword(payload)).unwrap();
      toast.success("Đổi mật khẩu thành công!");
    } catch (err) {
      console.log("Lỗi: ", err);
      setError("oldPassword", {
        type: "manual",
        message: "Mật khẩu hiện tại không đúng!",
      });
      toast.error("Cập nhật mật khẩu thất bại!");
    }
  };

  return (
    <div>
      <Box
        sx={{
          m: {
            xs: "1rem 1.5rem",
            md: "1.5rem 2.5rem",
          },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          sx={{ p: 0 }}
        >
          <Tab
            sx={{ fontSize: "14px", fontWeight: "700" }}
            label="Tài khoản"
            {...a11yProps(0)}
          />
          <Tab
            sx={{ fontSize: "14px", fontWeight: "700" }}
            label="Bảo mật"
            {...a11yProps(1)}
          />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <Box
            bgcolor={theme.palette.background.alt}
            sx={{ borderRadius: "4px" }}
          >
            <div className="flex space-y-4 py-5 mx-5 border-b border-gray-600">
              <Avatar
                variant="rounded"
                src={
                  selectedAvatar
                    ? URL.createObjectURL(selectedAvatar)
                    : user.avatar || ""
                }
                sx={{ width: 100, height: 100, m: 0 }}
              />
              <div className="flex items-center gap-2 h-full mx-4">
                <Button variant="contained" color="secondary" component="label">
                  Chọn ảnh
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setSelectedAvatar(e.target.files[0])}
                  />
                </Button>
                <Button variant="outlined" color="secondary">
                  Khôi phục
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleUploadAvatar}
                  disabled={!selectedAvatar}
                >
                  Cập nhật
                </Button>
              </div>
            </div>
            <form className="p-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row md:gap-8 gap-4 my-4 md:mb-8 md:justify-between">
                <div className="w-full md:w-1/2">
                  <InputField
                    label="Tên người dùng"
                    min={5}
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

              <div className="flex flex-col md:flex-row gap-8 md:justify-between ">
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
                <div className="w-full md:w-1/2">
                  <InputField
                    label="Chức vụ"
                    id="role"
                    disabled
                    type="text"
                    placeholder="Phân quyền"
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="mt-8">
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ marginRight: "14px" }}
                >
                  Hủy bỏ
                </Button>
                <Button type="submit" variant="contained" color="secondary">
                  Thay đổi
                </Button>
              </div>
            </form>
          </Box>
          <Box
            bgcolor={theme.palette.background.alt}
            sx={{ borderRadius: "4px", mt: 3, p: "20px" }}
          >
            <span className="text-lg font-semibold">Xóa tài khoản</span>
            <Alert
              variant="outlined"
              severity="warning"
              className="mt-5"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <div className="text-lg font-medium">
                Bạn có chắc chắn muốn xóa tài khoản của mình không?
              </div>
              <div className="text-sm">
                Một khi bạn đã xóa tài khoản, bạn sẽ không thể quay lại được
                nữa. Hãy chắc chắn nhé.
              </div>
            </Alert>
            <div className="text-sm font-medium flex items-center space-x-1 my-3">
              <Checkbox
                id="confirm"
                checked={checked}
                onChange={handleCheckboxChange}
                color="secondary"
              />
              <label htmlFor="confirm">
                Tôi xác nhận việc xóa tài khoản của tôi
              </label>
            </div>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={handleDelete}
              disabled={!checked}
            >
              Xóa tài khoản
            </Button>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Box
            bgcolor={theme.palette.background.alt}
            sx={{ borderRadius: "4px", p: 2 }}
          >
            <form onSubmit={handleSubmit(onSubmitPassword)}>
              <span className="text-lg font-semibold">Thay đổi mật khẩu</span>

              <div className="flex flex-col md:flex-row md:gap-8 md:justify-between mt-6">
                <div className="w-full md:w-1/2">
                  <PasswordInput
                    label="Mật khẩu hiện tại"
                    placeholder="Nhập mật khẩu hiện tại"
                    name="oldPassword"
                    register={register}
                    required
                    error={errors.oldPassword}
                    message="Bắt buộc nhập mật khẩu cũ"
                  />
                </div>
                <div className="w-full md:w-1/2"></div>
              </div>

              <div className="flex flex-col md:flex-row md:gap-8 md:justify-between mb-4">
                <div className="w-full md:w-1/2">
                  <PasswordInput
                    label="Mật khẩu mới"
                    placeholder="Nhập mật khẩu mới"
                    name="newPassword"
                    register={register}
                    required
                    min={5}
                    error={errors.newPassword}
                    message="Bắt buộc nhập mật khẩu mới"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <PasswordInput
                    label="Xác nhận mật khẩu"
                    placeholder="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    register={register}
                    required
                    min={5}
                    error={errors.confirmPassword}
                    message="Bắt buộc nhập mật khẩu mới"
                  />
                </div>
              </div>

              <Box color={theme.palette.text.secondary}>
                <span className="text-sm font-semibold">
                  Yêu cầu về mật khẩu:
                </span>
                <ul className="text-sm font-semibold space-y-3 mt-3 list-disc pl-5">
                  <li>Tối thiểu 5 ký tự - càng nhiều càng tốt</li>
                  <li>Ít nhất một ký tự viết thường</li>
                  <li>Ít nhất một ký tự viết hoa</li>
                </ul>
              </Box>

              <Button
                sx={{ mt: 4, mb: 2 }}
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
              >
                Lưu thay đổi
              </Button>
            </form>
          </Box>
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default Account;

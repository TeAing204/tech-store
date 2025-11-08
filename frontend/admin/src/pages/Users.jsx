import {
  Box,
  Button,
  Drawer,
  IconButton,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";

import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, softDeleteUser } from "../features/users/userSlice";
import { authRegister } from "../features/auth/authSlice";
import Header from "../layouts/Header";
import IsLoading from "../components/spinner/IsLoading";
import Table from "../components/share/Table";
import FlexBetween from "../components/share/FlexBetween";
import CloseIcon from "@mui/icons-material/Close";
import InputField from "../components/form/InputField";
import SelectForm from "../components/form/SelectForm";
import ConfirmDialog from "../components/share/ConfirmDialog";
import ToolBarUser from "../features/users/ToolBarUser";
import { getUserColumns } from "../features/users/userColumns";

const Users = () => {
  const { users, isLoading, errorMessage, pagination } = useSelector(
    (state) => state.users
  );
  const dispatch = useDispatch();
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const clearSelectedUsers = () => setSelectedUserIds([]);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      roles: [],
    },
  });

  const roleOptions = useMemo(() => {
    if (!users || users.length === 0) return [];

    const allRoles = users.flatMap((user) => user.roles || []);
    const uniqueRoles = Array.from(
      new Map(allRoles.map((r) => [r.roleId, r])).values()
    );

    return uniqueRoles.map((r) => ({
      label: r.roleName
        .replace("ROLE_", "")
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase()),
      value: r.roleId,
    }));
  }, [users]);

  const registerHandler = async (data) => {
    const result = await dispatch(authRegister({ sendData: data }));

    if (authRegister.fulfilled.match(result)) {
      reset();
      setOpen(false);
      dispatch(fetchUsers());
    }
  };

  const openConfirm = useCallback((title, description, onConfirm) => {
    setConfirmData({ title, description, onConfirm });
    setConfirmOpen(true);
  }, []);
  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  const softDeleteHandler = useCallback(
    (userId) => {
      openConfirm(
        "Xóa người dùng",
        "Bạn có chắc chắn muốn xóa người dùng này?",
        async () => {
          try {
            await dispatch(softDeleteUser({ userIds: userId })).unwrap();
            toast.success("Người dùng đã được chuyển vào thùng rác!");
          } catch (err) {
            console.log("Lỗi: ", err);
            toast.error("Xóa người dùng thất bại!");
          } finally {
            closeConfirm();
          }
        }
      );
    },
    [dispatch, openConfirm, closeConfirm]
  );

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
        <Header title="NHÂN SỰ" subtitle="Danh sách nhân viên." />
        <ToolBarUser
          roleOptions={roleOptions}
          selectedUserIds={selectedUserIds}
          onClearSelection={clearSelectedUsers}
          setOpen={setOpen}
        />
        {isLoading ? (
          <IsLoading />
        ) : errorMessage ? (
          <div>{errorMessage?.message || errorMessage}</div>
        ) : (
          <Box sx={{ overflowX: "auto", width: "100%", minWidth: 0 }}>
            <Table
              isLoading={isLoading}
              data={users || []}
              columns={getUserColumns(softDeleteHandler)}
              onSelectionChange={(selection) => setSelectedUserIds(selection)}
              selectedIds={selectedUserIds}
              pagination={pagination}
            />
          </Box>
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
            <div className="text-xl">Thêm nhân sự</div>
            <button className="cursor-pointer" onClick={() => setOpen(false)}>
              <CloseIcon />
            </button>
          </FlexBetween>

          {/* Form nhập */}
          <Box sx={{ mt: 4, flex: 1 }} className="space-y-5">
            <InputField
              label="Tài khoản"
              required
              id="username"
              type="text"
              message="*Tài khoản không được để trống"
              placeholder="Tên tài khoản"
              register={register}
              errors={errors}
              className="font-semibold text-base pb-1"
            />
            <InputField
              label="Email"
              required
              id="email"
              type="email"
              message="*Email không được để trống"
              placeholder="Email"
              register={register}
              errors={errors}
              className="font-semibold text-base pb-1"
            />
            <InputField
              label="Số điện thoại"
              required
              id="phoneNumber"
              type="text"
              message="*Số điện thoại không được để trống"
              placeholder="Số điện thoại"
              register={register}
              errors={errors}
              className="font-semibold text-base pb-1"
            />
            <InputField
              label="Mật khẩu"
              required
              id="password"
              type="password"
              message="*Mật khẩu không được để trống"
              placeholder="Mật khẩu"
              register={register}
              errors={errors}
              className="font-semibold text-base pb-1"
            />
            <SelectForm
              name="roles"
              title="Nhóm quyền"
              action="Thêm quyền"
              linkAction="#"
              control={control}
              options={roleOptions.map((r) => ({
                label: r.label,
                value: r.label.toLowerCase(),
              }))}
              valueKey="value"
              labelKey="label"
            />
          </Box>

          {/* Footer */}
          <Button
            onClick={handleSubmit(registerHandler)}
            variant="contained"
            sx={{ py: "8px", fontSize: "16px", mt: 3 }}
            color="secondary"
          >
            Thêm
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

export default Users;

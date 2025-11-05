import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputField from "../components/form/InputField";
import { login } from "../features/auth/authSlice";
import FlexBetween from "../components/share/FlexBetween";
import { Button, createTheme, ThemeProvider } from "@mui/material";
import { themeSettings } from "../utils/theme";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { toast } from "react-hot-toast";
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched" });
  const lightTheme = createTheme(themeSettings("light"));

  const loginHandler = async (data) => {
  try {
    const res = await dispatch(login(data));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Đăng nhập thành công!");
      reset();
    } else {
      toast.error(res.payload?.message || "Đăng nhập thất bại!");
    }
  } catch (error) {
    toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    console.error(error);
  }
};
  return (
    <ThemeProvider theme={lightTheme}>
      <div className="bg-[#edf2f9] w-full h-full">
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
          <form
            onSubmit={handleSubmit(loginHandler)}
            className="sm:w-[450px] w-[360px] bg-white shadow py-8 sm:px-8 px-4 rounded-md"
          >
            <div className="flex items-center flex-col text-blue-600 font-bold mb-4">
              <LoginIcon sx={{fontSize: 40}}/>
              <span className="text-3xl">Chào mừng</span>
            </div>
            <FlexBetween className="mb-4">
              <div className="text-xl font-semibold text-black">Đăng nhập</div>
              <div className="text-sm">
                {" "}
                hoặc
                <Link className="text-blue-500"> Tạo tài khoản</Link>
              </div>
            </FlexBetween>
            <div className="flex flex-col gap-3">
              <InputField
                label="Tài khoản"
                required
                id="username"
                type="text"
                message="*Tài khoản không được để trống"
                placeholder="Nhập tên của bạn"
                register={register}
                errors={errors}
              />
              <InputField
                label="Mật khẩu"
                required
                id="password"
                type="password"
                message="*Mật khẩu không được để trống"
                placeholder="Nhập mật khẩu của bạn"
                register={register}
                errors={errors}
              />
            </div>
            <FlexBetween className="my-4">
              <div className="text-sm text-neutral-600 font-medium flex items-center space-x-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="accent-blue-600 w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="cursor-pointer select-none"
                >
                  Nhớ mật khẩu
                </label>
              </div>

              <Link className="text-blue-500 text-sm">Quên mật khẩu?</Link>
            </FlexBetween>

            <Button
              type="submit"
              sx={{
                textTransform: "none",
                width: "100%",
                height: "40px",
                fontSize: "16px",
                color: "#fff",
                backgroundColor: "#1877F2", 
                transition: "background-color 0.3s ease", 
                "&:hover": {
                  backgroundColor: "#0B5CCB", 
                },
              }}
            >
              {/* {loader ? (
                            <p>Loading...</p>
                        ) : ( */}
              <p>Đăng nhập</p>
              {/* )} */}
            </Button>
            <div className="flex items-center justify-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-400 text-sm">
                hoặc đăng nhập với
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <FlexBetween className="gap-x-4">
              <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  borderColor: "#DB4437",
                  color: "#DB4437",
                  textTransform: "none",
                  width: "100%",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#DB4437",
                    backgroundColor: "rgba(219, 68, 55, 0.1)",
                  },
                }}
              >
                Google
              </Button>
              <Button
                variant="outlined"
                startIcon={<FacebookIcon />}
                sx={{
                  borderColor: "#1877F2",
                  color: "#1877F2",
                  textTransform: "none",
                  width: "100%",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#1877F2",
                    backgroundColor: "rgba(24, 119, 242, 0.1)",
                  },
                }}
              >
                Facebook
              </Button>
            </FlexBetween>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;

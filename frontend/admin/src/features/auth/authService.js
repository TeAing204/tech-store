import api from "../../api/api";

const authService = {
  login: async (formData) => {
    const response = await api.post("/auth/signin", formData);
    const data = response.data;
    return {
      userId: data.id,
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber,
      token: data.jwtToken,
      roles: data.roles.map((r) => r.replace("ROLE_", "").toLowerCase()), // ví dụ: "ROLE_ADMIN" → "admin"
    };
  },
  register: async (formData) => {
    const response = await api.post("/auth/signup", formData);
    console.log("data response: ", response.data);
    return response.data;
  },
  updateAccount: async (formData) => {
    const { data } = await api.put("/account", formData);
    return data;
  },
  updateAccountImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const { data } = await api.post("/account/image", formData);
    return data;
  },
  getUserDetail: async () => {
    const {data} = await api.get("/auth/user");
    return data;
  },
  updatePassword: async (formData) => {
    const {data} = await api.post("/auth/update-password", formData);
    return data;
  }
};

export default authService;

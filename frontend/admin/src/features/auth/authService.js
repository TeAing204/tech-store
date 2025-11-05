import api from '../../api/api'

const authService = {
    login: async (formData) => {
        const response = await api.post("/auth/signin", formData);
        const data = response.data;
        return {
        username: data.username,
        token: data.jwtToken, 
        roles: data.roles.map((r) => r.replace("ROLE_", "").toLowerCase()), // ví dụ: "ROLE_ADMIN" → "admin"
        };
    },
    register: async (formData) => {
        const response = await api.post("/auth/signup", formData);
        console.log("data response: ", response.data);
        return response.data;
    },
};


export default authService

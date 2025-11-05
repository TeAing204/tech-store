import api from "../../api/api";

export const userService = {
  fetchUsers: async (params) => {
    const { data } = await api.get("/admin/sellers", { params });
    return data;
  },

  fetchTrashUsers: async (params) => {
    const { data } = await api.get("/admin/sellers/trash", { params });
    return data;
  },

  updateUser: async (userId, user, image) => {
    const formData = new FormData();
    formData.append(
      "user",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    );
    if (image) formData.append("image", image);

    const { data } = await api.put(`/admin/users/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  updateUserStatus: async (userId, status) => {
    const { data } = await api.patch(`/admin/user/${userId}/status`, null, {
      params: { status },
    });
    return data;
  },

  softDeleteUser: async (userIds) => {
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    await api.delete(`/admin/soft/users`, { data: ids });
    return ids;
  },

  deleteUser: async (userIds) => {
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    await api.delete("/admin/users", { data: ids });
    return ids;
  },

  restoreUser: async (userIds) => {
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    await api.post("/admin/restore/users", ids);
    return ids;
  },
};

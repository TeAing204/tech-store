import api from "../../api/api";

const fetchCategories = async (params = {}) => {
  const { data } = await api.get("/public/categories", { params });
  return data;
};

const addCategory = async ({ categoryName, description }) => {
  const { data } = await api.post(
    "/admin/category",
    { categoryName, description },
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
};

const deleteCategory = async ({categoryIds}) => {
  const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
  await api.delete("/admin/categories", { data: ids });
  return ids;
};

const updateCategoryStatus = async ({ categoryId, status }) => {
  const { data } = await api.patch(`/admin/category/${categoryId}/status`, null, {
    params: { status },
  });
  return data;
};

const updateCategory = async ({ categoryId, categories }) => {
  const { data } = await api.put(`/admin/category/${categoryId}`, categories);
  return data;
};

const categoryService = {
  fetchCategories,
  addCategory,
  deleteCategory,
  updateCategoryStatus,
  updateCategory,
};

export default categoryService;

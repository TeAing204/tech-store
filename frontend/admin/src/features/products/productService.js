import api from "../../api/api";

const productService = {
  fetchProducts: (params = {}) => api.get(`/public/products`, { params }),
  fetchTrashProducts: (params = {}) => api.get(`/admin/trash/products`, { params }),

  addProduct: (categoryId, product, images) => {
    const formData = new FormData();
    formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
    if (images?.length > 0) {
      images.forEach((file) => formData.append("images", file));
    }
    return api.post(`/admin/category/${categoryId}/product`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateProduct: (productId, product, images) => {
    const formData = new FormData();
    formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
    if (images?.length) {
      images.forEach((img) => formData.append("images", img));
    }
    return api.put(`/admin/product/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteProducts: (productIds) => api.delete(`/admin/products`, { data: productIds }),
  softDeleteProducts: (productIds) => api.delete(`/admin/soft/products`, { data: productIds }),
  restoreProducts: (productIds) => api.post(`/admin/restore/products`, productIds),
  updateProductStatus: (productId, isActive) =>
    api.patch(`/admin/product/${productId}/status`, null, { params: { active: isActive } }),
};

export default productService;

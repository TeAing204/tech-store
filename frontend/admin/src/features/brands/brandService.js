import api from "../../api/api";


const fetchBrands = async (params = {}) => {
  const { data } = await api.get("/public/brands", { params });
  return data;
};

const addBrand = async ({ brandName, description }) => {
  const { data } = await api.post(
    "/admin/brand",
    { brandName, description },
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
};

const deleteBrand = async ({brandIds}) => {
  const ids = Array.isArray(brandIds) ? brandIds : [brandIds];
  await api.delete("/admin/brands", { data: ids });
  return ids;
};

const updateBrandStatus = async ({ brandId, status }) => {
  const { data } = await api.patch(`/admin/brand/${brandId}/status`, null, {
    params: { status },
  });
  return data;
};

const updateBrand = async ({ brandId, brands }) => {
  const { data } = await api.put(`/admin/brand/${brandId}`, brands);
  return data;
};

const brandService = {
  fetchBrands,
  addBrand,
  deleteBrand,
  updateBrandStatus,
  updateBrand,
};

export default brandService;

import { Box } from '@mui/material'
import { useRef } from 'react'
import Header from '../layouts/Header';
import AddProductAct from '../features/products/AddProductAct';
import ProductForm from '../features/products/ProductForm';

const AddProduct = () => {
  const resetFormRef = useRef(null);
  return (
    <div>
        <Box m="1.5rem 2.5rem">
            <div className='flex sm:justify-between sm:items-end flex-col sm:flex-row gap-y-5'>
              <Header title="THÊM SẢN PHẨM" subtitle="Thêm sản phẩm." />
              <AddProductAct onReset={() => resetFormRef.current?.()} />
            </div>
            <ProductForm onResetRef={(resetFunc) => (resetFormRef.current = resetFunc)} />
        </Box>
    </div>
  )
}

export default AddProduct
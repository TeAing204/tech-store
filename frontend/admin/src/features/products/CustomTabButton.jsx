import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  useTheme,
  useMediaQuery, 
} from "@mui/material";
import InputIcon from "@mui/icons-material/Input";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PublicIcon from "@mui/icons-material/Public";
import TuneIcon from "@mui/icons-material/Tune";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SellIcon from "@mui/icons-material/Sell";
import InputField from "../../components/form/InputField";
import RadioForm from "../../components/form/RadioForm";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ flex: 1, padding: 16 }}
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

export default function SidebarTabs({ register, errors }) {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row", 
        border: "1px solid",
        borderColor: theme.palette.border.main,
        borderRadius: 2,
        mt: 3,
      }}
    >
      <Tabs
        orientation={isSmallScreen ? "horizontal" : "vertical"} 
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="responsive tabs"
        sx={{
          borderRight: isSmallScreen ? 0 : 1,
          borderBottom: isSmallScreen ? 1 : 0,
          borderColor: "divider",
          marginY: isSmallScreen ? 0 : 2,
          minWidth: isSmallScreen ? "auto" : 180,
          alignItems: isSmallScreen ? "center" : "flex-start",
          "& .MuiTab-root": {
            justifyContent: "flex-start",
            minHeight: "40px",
            textAlign: "left",
            color: theme.palette.text.primary,
            "&.Mui-selected": {
              color: theme.palette.secondary.main,
            },
          },
        }}
      >
        <Tab icon={<SellIcon size={18} />} iconPosition="start" label="Giá cả" {...a11yProps(0)} />
        <Tab icon={<InputIcon size={16} />} iconPosition="start" label="Nhập hàng" {...a11yProps(1)} />
        <Tab icon={<LocalShippingIcon size={16} />} iconPosition="start" label="Vận chuyển" {...a11yProps(2)} />
        <Tab icon={<PublicIcon size={18} />} iconPosition="start" label="Giao hàng toàn cầu" {...a11yProps(3)} />
        <Tab icon={<TuneIcon size={16} />} iconPosition="start" label="Thuộc tính" {...a11yProps(4)} />
        <Tab icon={<LockOutlinedIcon size={16} />} iconPosition="start" label="Nâng cao" {...a11yProps(5)} />
      </Tabs>

      {/* Nội dung Tab */}
      <CustomTabPanel value={value} index={0}>
        <div className="flex flex-col xl:flex-row gap-4">
          <InputField
            label="Giá mặc định"
            required
            id="price"
            type="number"
            message="*Giá sản phẩm không được để trống"
            placeholder="Giá mặc định"
            register={register}
            errors={errors}
          />
          <InputField
            label="Giảm giá"
            id="discount"
            type="number"
            placeholder="Nhập tỉ lệ %"
            register={register}
            errors={errors}
          />
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <InputField
          label="Thêm vào kho"
          id="quantity"
          type="number"
          placeholder="Nhập số lượng nhập vào"
          register={register}
          errors={errors}
        />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <FormControl className="space-y-4">
          <label className="text-md font-semibold">Hình thức vận chuyển</label>
          <RadioGroup defaultValue="bySeller" className="space-y-4">
            <RadioForm
              value="bySeller"
              title="Được thực hiện bởi người bán"
              description="Bạn chịu trách nhiệm giao hàng..."
            />
            <RadioForm
              value="byTeAing"
              title="Được thực hiện bởi TeAing"
              description="Chúng tôi sẽ xử lý quy trình giao hàng..."
            />
          </RadioGroup>
        </FormControl>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        <FormControl className="space-y-4">
          <label className="text-md font-semibold">Phạm vi giao hàng</label>
          <RadioGroup defaultValue="select" className="space-y-2">
            <RadioForm value="worldwideDelivery" title="Giao hàng trên thế giới" />
            <RadioForm value="select" title="Các quốc gia được chọn" />
            <RadioForm value="localDelivery" title="Giao hàng tận nơi" />
          </RadioGroup>
        </FormControl>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
        <FormGroup>
          <label className="text-md font-semibold pb-4">Thuộc tính</label>
          <FormControlLabel control={<Checkbox color="secondary" defaultChecked />} label="Sản phẩm dễ vỡ" />
          <FormControlLabel control={<Checkbox color="secondary" />} label="Có thể phân hủy sinh học" />
          <FormControlLabel control={<Checkbox color="secondary" />} label="Sản phẩm đông lạnh" />
        </FormGroup>
      </CustomTabPanel>
    </Box>
  );
}

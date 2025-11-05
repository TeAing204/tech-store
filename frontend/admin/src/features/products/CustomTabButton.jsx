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
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ flex: 1, padding: 16 }}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function SidebarTabs({ register, errors }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid",
        borderColor: theme.palette.border.main,
        borderRadius: 2,
        mt: 3,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs with icons"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          marginY: 2,
          minWidth: 180,
          alignItems: "flex-start",
          "& .MuiTab-root": {
            justifyContent: "flex-start",
            minHeight: "40px",
            textAlign: "left",
            color: theme.palette.text.primary,
            "&.Mui-focusVisible": {
              color: theme.palette.secondary.main,
            },
            "&.Mui-selected": {
              color: theme.palette.secondary.main,
            },
          },
        }}
      >
        <Tab
          icon={<SellIcon size={18} />}
          iconPosition="start"
          label="Giá cả"
          {...a11yProps(0)}
        />
        <Tab
          icon={<InputIcon size={16} />}
          iconPosition="start"
          label="Nhập hàng"
          {...a11yProps(1)}
        />
        <Tab
          icon={<LocalShippingIcon size={16} />}
          iconPosition="start"
          label="Vận chuyển"
          {...a11yProps(2)}
        />
        <Tab
          icon={<PublicIcon size={18} />}
          iconPosition="start"
          label="Giao hàng toàn cầu"
          {...a11yProps(0)}
        />
        <Tab
          icon={<TuneIcon size={16} />}
          iconPosition="start"
          label="Thuộc tính"
          {...a11yProps(1)}
        />
        <Tab
          icon={<LockOutlinedIcon size={16} />}
          iconPosition="start"
          label="Nâng cao"
          {...a11yProps(2)}
        />
      </Tabs>

      {/* Nội dung */}
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
        <div>
          <FormControl className="space-y-4">
            <label htmlFor="" className="text-md font-semibold">
              Hình thức vận chuyển
            </label>
            <RadioGroup
              defaultValue="bySeller"
              name="radio-buttons-group"
              className="space-y-4"
            >
              <RadioForm
                value="bySeller"
                title="Được thực hiển bởi người bán"
                description="Bạn sẽ chịu trách nhiệm giao hàng. Bất kỳ hư hỏng hoặc chậm trễ nào trong quá trình vận chuyển có thể khiến bạn phải trả phí thiệt hại."
              />
              <RadioForm
                value="byTeAing"
                title="Được thực hiển bởi TeAing"
                description="Sản phẩm của bạn, trách nhiệm của chúng tôi.
                  Chỉ với một khoản phí nhỏ, chúng tôi sẽ xử lý quy trình giao hàng cho bạn."
              />
            </RadioGroup>
          </FormControl>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <div>
          <FormControl className="space-y-4">
            <label htmlFor="" className="text-md font-semibold">
              Phạm vi giao hàng
            </label>
            <RadioGroup
              defaultValue="select"
              name="radio-buttons-group"
              className="space-y-2"
            >
              <RadioForm
                value="worldwideDelivery"
                title="Giao hàng trên thế giới"
                description="Chỉ có sẵn với phương thức vận chuyển: Fullfilled by TeAing"
              />
              <RadioForm value="select" title="Các quốc gia được chọn" />
              <RadioForm
                value="localDelivery"
                title="Giao hàng tận nơi"
                description="Giao hàng đến quốc gia cư trú của bạn."
              />
            </RadioGroup>
          </FormControl>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <div>
          <FormGroup>
            <label htmlFor="" className="text-md font-semibold pb-4">
              Thuộc tính
            </label>
            <FormControlLabel
              control={<Checkbox color="secondary" defaultChecked />}
              label="Sản phẩm dễ vỡ"
            />
            <FormControlLabel
              control={<Checkbox color="secondary" />}
              label="Có thể phân hủy sinh học"
            />
            <FormControlLabel
              control={<Checkbox color="secondary" />}
              label="Sản phẩm đông lạnh"
            />
          </FormGroup>
        </div>
      </CustomTabPanel>
    </Box>
  );
}

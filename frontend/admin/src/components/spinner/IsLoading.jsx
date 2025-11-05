
import { ScaleLoader } from "react-spinners";

const IsLoading = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-6 py-10">
      <div>Đang tải dữ liệu...</div>
      <ScaleLoader color="#ffd166" width={10} height={100} margin={4} />
    </div>
  );
};

export default IsLoading;

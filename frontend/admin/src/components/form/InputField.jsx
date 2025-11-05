import { useTheme } from "@mui/material/styles";

const InputField = ({
  label,
  id,
  type,
  errors,
  register,
  required,
  message,
  className,
  min,
  placeholder,
}) => {
  const theme = useTheme();

  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={id}
        className={`${className ? className : "font-semibold text-sm pb-1"} `}
        style={{ color: theme.palette.text.primary }}
      >
        {label}
      </label>

      <input
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        className={`px-4 py-2 border border-[#c2c2c2] outline-none rounded-md bg-transparent transition-all duration-150
    focus:ring-2 focus:ring-blue-300 focus:border-blue-400`}
        style={{
          color: theme.palette.text.primary, 
          borderColor: errors[id]
            ? "red"
            : undefined 
        }}
        {...register(id, {
          required: { value: required, message },
          minLength: min
            ? { value: min, message: `Minimum ${min} character is required` }
            : null,
          pattern:
            type === "email"
              ? {
                  value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+com+$/,
                  message: "Invalid email",
                }
              : type === "url"
              ? {
                  value:
                    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(:[0-9]{1,5})?(\/[^\s?#]*)?(\?[^\s#]*)?(#[^\s]*)?$/,
                  message: "Please enter a valid url",
                }
              : null,
        })}
      />

      {errors[id]?.message && (
        <p className="text-sm font-semibold mt-0" style={{ color: "red" }}>
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
};

export default InputField;

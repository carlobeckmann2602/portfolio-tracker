import { BaseSyntheticEvent, ReactNode, RefObject, useState } from "react";
import cn from "classnames";

export type InputProps = {
  type?: string;
  name: string;
  placeholder?: string;
  innerRef?: RefObject<HTMLInputElement>;
  icon?: ReactNode;
  className?: string;
  defaultValue?: string | number;
  value?: string | number;
  disabled?: boolean;
  onChange?: (evt: BaseSyntheticEvent) => void;
};

export const Input = ({
  type = "text",
  name,
  placeholder,
  icon,
  innerRef,
  className,
  defaultValue,
  value,
  disabled = false,
  onChange,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  return (
    <div className={`relative text-base form-group ${className}`}>
      <label className="flex flex-col">
        {icon && (
          <div
            className={cn(
              "h-5 w-5 absolute box-border top-1/3 ml-5 pointer-events-none transition",
              !isFocused && !hasContent && "opacity-60"
            )}
          >
            {icon}
          </div>
        )}
        <input
          defaultValue={defaultValue}
          value={value}
          type={type}
          name={name}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onInput={(evt) =>
            setHasContent(!!(evt.target as HTMLInputElement).value)
          }
          onChange={onChange}
          className="border border-transparent outline-none border-solid focus:border-highlight1 p-3 pl-14 rounded-[10px] bg-front/10 font-light text-lg"
          ref={innerRef}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

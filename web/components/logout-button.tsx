import cn from "classnames";
import { useLogout, useUser } from "../lib/backend";

export const LogoutButton = () => {
  const user = useUser();
  const { mutate: logout, isLoading } = useLogout();

  const disabled = !user || isLoading;

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 top-2 inset-x-6 flex justify-end text-xs xs:text-sm font-light transition duration-500",
        disabled ? "opacity-0" : "opacity-50"
      )}
    >
      <button
        onClick={logout}
        disabled={disabled}
        className={cn("hover:underline", !disabled && "pointer-events-auto")}
      >
        Logout
      </button>
    </div>
  );
};

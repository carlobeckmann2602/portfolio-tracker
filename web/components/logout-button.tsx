import cn from "classnames";
import { useLogout, useUser } from "../lib/backend";

export const LogoutButton = () => {
  const user = useUser();
  const { mutate: logout, isLoading } = useLogout();

  const disabled = !user || isLoading;

  return (
    <div
      className={cn(
        "pointer-events-none absolute top-4 inset-x-6 flex justify-end text-sm font-light transition duration-500",
        disabled ? "opacity-0" : "opacity-75"
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

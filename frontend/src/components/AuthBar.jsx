import { useEffect, useState } from "react";
import { me, logout } from "../services/api";

export default function AuthBar() {
  const [user, setUser] = useState(null);
  useEffect(() => { me().then(setUser).catch(() => setUser(null)); }, []);
  const doLogout = async () => { await logout(); window.location.href = "/login"; };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">
        {user ? `Signed in as ${user.email}` : "Not signed in"}
      </span>
      {user && (
        <button
          onClick={doLogout}
          className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          Logout
        </button>
      )}
    </div>
  );
}
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig"; // adjust path

export const logoutUser = async () => {
  try {
    await signOut(auth);
    window.location.href = "/login"; // redirect after logout
  } catch (err) {
    console.error("Logout error:", err);
  }
};

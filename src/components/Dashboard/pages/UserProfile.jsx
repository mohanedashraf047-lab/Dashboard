import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../../../../firebaseConfig";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { UserContext } from "../../../UserContext";
import { logoutUser } from "../../layout/Logout";
import Swal from "sweetalert2";

const UserProfile = () => {
  const { user: contextUser, setUser: setContextUser } =
    useContext(UserContext);
  const [user, setUser] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formInitial, setFormInitial] = useState({
    displayName: "",
    dob: "",
    photoURL: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  // ✅ MOVE LOGOUT ALERT OUTSIDE USEEFFECT
  const handleLogoutClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser();

        Swal.fire({
          title: "Logged out",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      setUser(currentUser);
      setFormInitial({
        displayName: currentUser.displayName || "",
        photoURL: currentUser.photoURL || "",
        dob: "",
      });

      // Load DOB from Firestore
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setFormInitial((prev) => ({
          ...prev,
          dob: snap.data().dob || "",
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const uploadImage = async (file, setFieldValue) => {
    if (!file) return;
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Dashboard");
      formData.append("folder", "profileImages");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dxeozov3j/image/upload`,
        formData
      );

      const url = res.data.secure_url;
      setFieldValue("photoURL", url); // Update Formik value
      await updateProfile(auth.currentUser, { photoURL: url });
    } catch (error) {
      console.error(error);
      setMessage({ text: "Image upload failed.", type: "error" });
    }

    setUploadingImage(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 transition-all">
        <h2 className="text-2xl font-bold text-zinc-500 dark:text-white mb-6 italic animate-pulse">
          Edit Profile
        </h2>

        <Formik
          enableReinitialize
          initialValues={formInitial}
          onSubmit={async (values, { setSubmitting }) => {
            setMessage({ text: "", type: "" });
            try {
              await updateProfile(auth.currentUser, {
                displayName: values.displayName,
                photoURL: values.photoURL,
              });

              await setDoc(
                doc(db, "users", user.uid),
                { dob: values.dob },
                { merge: true }
              );

              setContextUser((prev) => ({
                ...prev,
                displayName: values.displayName,
                dob: values.dob,
                photoURL: values.photoURL,
              }));

              setMessage({
                text: "Profile updated successfully!",
                type: "success",
              });
            } catch (err) {
              console.error(err);
              setMessage({ text: "Error: " + err.message, type: "error" });
            }

            setSubmitting(false);
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-6">
              {/* IMAGE UPLOAD */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={
                      values.photoURL ||
                      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                    }
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-500 shadow-md transition hover:scale-105"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow cursor-pointer transition">
                    {uploadingImage ? "Uploading…" : "Change"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        uploadImage(e.target.files[0], setFieldValue)
                      }
                    />
                  </label>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    {values.displayName || user?.email}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Email: {user?.email}
                  </p>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">
                  Display Name
                </label>
                <Field
                  name="displayName"
                  type="text"
                  className="mt-1 w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white transition-all"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">
                  Date of Birth
                </label>
                <Field
                  name="dob"
                  type="date"
                  className="mt-1 w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white transition-all"
                />
              </div>

              {/* Form message */}
              {message.text && (
                <div
                  className={`p-3 rounded-lg text-sm font-medium ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                      : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition shadow-md"
              >
                {isSubmitting ? "Saving…" : "Save Changes"}
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition shadow-md"
              >
                Logout
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserProfile;

import { createSlice } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

const initialState = {
  userEmail: null,
  items: [],
  activities: [],
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setUserEmail(state, action) {
      state.userEmail = action.payload;
    },
    setProducts(state, action) {
      state.items = action.payload;
    },
    setActivities(state, action) {
      state.activities = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setUserEmail, setProducts, setActivities, setError } =
  productSlice.actions;

/* ----------------------------------------
   ACTIVITY LOGGER
---------------------------------------- */
export const addActivityFirebase = async (activity, userEmail) => {
  if (!userEmail) return;

  try {
    await addDoc(collection(db, "activities"), {
      title: activity.title,
      description: activity.description,
      iconName: activity.iconName, // MUST be string
      color: activity.color,
      bgColor: activity.bgColor,
      userEmail,
      createdAt: serverTimestamp(),
      time: new Date().toLocaleTimeString(),
    });

    console.log("Activity Saved:", activity);
  } catch (error) {
    console.error("ACTIVITY SAVE ERROR:", error);
  }
};

/* ----------------------------------------
   ADD PRODUCT
---------------------------------------- */
export const addProductFirebase = (product) => async (dispatch, getState) => {
  const userEmail = getState().products.userEmail;
  if (!userEmail) return;

  try {
    const productWithUser = { ...product, userEmail };
    await addDoc(collection(db, "products"), productWithUser);

    await addActivityFirebase(
      {
        title: "Added Product",
        description: `Added "${product.name}"`,
        iconName: "plus",
        color: "text-green-500",
        bgColor: "bg-green-100",
      },
      userEmail
    );
  } catch (error) {
    console.error("Failed to add product:", error);
    dispatch(setError(error.message));
  }
};

/* ----------------------------------------
   UPDATE PRODUCT
---------------------------------------- */
export const updateProductFirebase =
  (product) => async (dispatch, getState) => {
    const userEmail = getState().products.userEmail;
    if (!userEmail || !product.id) return;

    try {
      await updateDoc(doc(db, "products", product.id), product);

      await addActivityFirebase(
        {
          title: "Updated Product",
          description: `Updated "${product.name}"`,
          iconName: "edit",
          color: "text-blue-500",
          bgColor: "bg-blue-100",
        },
        userEmail
      );
    } catch (error) {
      console.error("Failed to update product:", error);
      dispatch(setError(error.message));
    }
  };

/* ----------------------------------------
   DELETE PRODUCT
---------------------------------------- */
export const deleteProductFirebase = (id) => async (dispatch, getState) => {
  const userEmail = getState().products.userEmail;
  if (!userEmail || !id) return;

  try {
    await deleteDoc(doc(db, "products", id));

    await addActivityFirebase(
      {
        title: "Removed Product",
        description: `Removed a product`,
        iconName: "x",
        color: "text-red-500",
        bgColor: "bg-red-100",
      },
      userEmail
    );
  } catch (error) {
    console.error("Failed to delete product:", error);
    dispatch(setError(error.message));
  }
};

export default productSlice.reducer;

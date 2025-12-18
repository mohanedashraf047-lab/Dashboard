import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig"; // adjust path
import {
  setUserEmail,
  setProducts,
  setActivities,
} from "../../redux/productSlice";
import ActivityFeed from "./ActivityFeed";
import ChartSection from "./ChartSection";
import StatsGrid from "./StatsGrid";
import TableSection from "./TableSection";

const Dashboard = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const activities = useSelector((state) => state.products.activities);
  const userEmail = useSelector((state) => state.products.userEmail);

  const [loading, setLoading] = useState(true);

  // Listen for Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        dispatch(setUserEmail(user.email));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Real-time Firestore listener for products
  useEffect(() => {
    if (!userEmail) return;

    const q = query(
      collection(db, "products"),
      where("userEmail", "==", userEmail)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((docItem) => {
        products.push({ id: docItem.id, ...docItem.data() });
      });
      dispatch(setProducts(products));
    });

    return () => unsubscribe();
  }, [userEmail, dispatch]);

  // Real-time Firestore listener for activities
  useEffect(() => {
    if (!userEmail) return;

    const q = query(
      collection(db, "activities"),
      where("userEmail", "==", userEmail)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const activities = [];
      querySnapshot.forEach((docItem) => {
        activities.push({ id: docItem.id, ...docItem.data() });
      });
      dispatch(setActivities(activities));
    });

    return () => unsubscribe();
  }, [userEmail, dispatch]);

  if (loading) {
    return <p className="text-center p-6">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <StatsGrid products={products} />

      {/* Charts Section */}
      <ChartSection products={products} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TableSection products={products} />
        </div>
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

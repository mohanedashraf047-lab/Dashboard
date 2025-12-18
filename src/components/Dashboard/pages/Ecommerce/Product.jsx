import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductFirebase,
  updateProductFirebase,
  deleteProductFirebase,
  setUserEmail,
  setProducts,
} from "../../../../redux/productSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../../../../../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EcommerceProduct = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const userEmail = useSelector((state) => state.products.userEmail);

  const [modalOpen, setModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: "",
    file: null,
  });
  const [search, setSearch] = useState("");

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) dispatch(setUserEmail(user.email));
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Firestore listener
  useEffect(() => {
    if (!userEmail) return;

    const q = query(
      collection(db, "products"),
      where("userEmail", "==", userEmail)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = [];
      snapshot.forEach((docItem) =>
        productsData.push({ id: docItem.id, ...docItem.data() })
      );
      dispatch(setProducts(productsData));
    });

    return () => unsubscribe();
  }, [userEmail, dispatch]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setNewProduct({ ...product, file: null });
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewProduct({ ...newProduct, file });
  };

  const handleAddOrEditProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.category
    ) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    let imageUrl = newProduct.image;

    if (newProduct.file) {
      const storageRef = ref(
        storage,
        `products/${Date.now()}-${newProduct.file.name}`
      );
      await uploadBytes(storageRef, newProduct.file);
      imageUrl = await getDownloadURL(storageRef);
    }

    const productData = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      image: imageUrl,
    };

    try {
      if (editProductId) {
        await dispatch(
          updateProductFirebase({ ...productData, id: editProductId })
        );
        Swal.fire(
          "Success!",
          `"${productData.name}" updated successfully`,
          "success"
        );
      } else {
        await dispatch(addProductFirebase(productData));
        Swal.fire(
          "Success!",
          `"${productData.name}" added successfully`,
          "success"
        );
      }

      setModalOpen(false);
      setEditProductId(null);
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        category: "",
        image: "",
        file: null,
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await dispatch(deleteProductFirebase(id));
      Swal.fire("Deleted!", "Product removed successfully", "success");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        Products
      </h1>
      <p className="text-slate-500 dark:text-slate-400">
        Manage products in your e-commerce store.
      </p>

      {/* Search + Add */}
      <div className="flex items-center justify-between mt-6">
        <input
          type="text"
          placeholder="Search products..."
          className="p-3 w-72 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md"
        >
          + Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border p-4"
            >
              {product.image && (
                <img
                  src={product.image}
                  className="h-40 w-full object-cover rounded-lg"
                />
              )}
              <h2 className="font-bold text-lg mt-2">{product.name}</h2>
              <p className="text-blue-600 font-semibold">${product.price}</p>
              <p className="text-sm">Stock: {product.stock}</p>
              <p className="text-sm">Category: {product.category}</p>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="px-3 py-2 bg-yellow-500 text-white rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-slate-500">
            No products found.
          </p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h2 className="text-xl font-bold">
              {editProductId ? "Edit Product" : "Add Product"}
            </h2>

            <input
              type="text"
              placeholder="Product Name"
              className="w-full p-3 bg-slate-100 rounded-lg"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full p-3 bg-slate-100 rounded-lg"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Stock"
              className="w-full p-3 bg-slate-100 rounded-lg"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              className="w-full p-3 bg-slate-100 rounded-lg"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
              className="w-full"
            />
            <input
              type="text"
              placeholder="Image URL"
              className="w-full p-3 bg-slate-100 rounded-lg"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />

            {(newProduct.image || newProduct.file) && (
              <img
                src={
                  newProduct.file
                    ? URL.createObjectURL(newProduct.file)
                    : newProduct.image
                }
                className="h-32 w-full object-contain rounded-lg border"
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={() => {
                  setModalOpen(false);
                  setEditProductId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={handleAddOrEditProduct}
              >
                {editProductId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcommerceProduct;

import { useEffect, useState } from "react";
import axios from "axios";
import ProductItem from "./ProductItem";
const Products = () => {
  const [products, setProducts] = useState([]);
  const API_URL = "http://localhost:8880/product/allproduct";
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URL);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const updateProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
        prevProducts.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
        )
  );
};
  return (
    <div>
    <h2 className="text-center text-2xl font-semibold">All Crops</h2>
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-10">
      {products.map((product, index) => (
        <div key={index}>
          <ProductItem product={product} setProduct={updateProduct} />
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Products;

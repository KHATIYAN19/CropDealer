import { useEffect, useState } from "react";
import axios from "axios";
import ProductItem from "./ProductItem";
import { AiOutlineSearch } from "react-icons/ai"; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

 
  const filteredProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl font-semibold font-serif">ALL CROPS FOR SELL</h2>
      <div className="flex items-center mx-auto w-72 border rounded-lg px-3 py-2 bg-white shadow-sm mt-4">
        <AiOutlineSearch className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search by crop,location ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none px-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-10">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={index}>
              <ProductItem product={product} setProduct={updateProduct} />
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No  Products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;

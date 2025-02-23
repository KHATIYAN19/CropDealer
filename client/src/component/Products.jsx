import { useState,useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import productss from "./Product.jpg"
import axios from "axios"
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState([]);
  const [priceRange, setPriceRange] = useState(10000);
  const { token } = useSelector((state) => state.auth);
  const[products,setProducts]=useState([]);
  const categories = ["Grains", "Vegetables", "Fruits"];
  const locations = ["Manipur", "Uttar Pradesh", "Punjab"];
  const navigate=useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8880/product/allProduct", {
              headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
            });
            setProducts(response.data.products);
            console.log(response.data.products);
        } catch (err) {
           console.log(err);
        } finally {
           // setLoading(false);
        }
    };
  
    fetchProducts();
  }, []);
  const handleCategoryChange = (category) => {
    setCategoryFilter((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setLocationFilter((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter.length === 0 || categoryFilter.includes(product.category)) &&
      (locationFilter.length === 0 || locationFilter.includes(product.state)) &&
      parseInt(String(product.price).replace(/[^0-9]/g, ""), 10) <= priceRange
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${productss})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl font-bold">Fresh Crops from Local Farmers</h1>
          <p className="text-lg">Discover quality produce directly from farms across India</p>
        </div>
      </div>
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <h3 className="font-medium mb-2">Categories</h3>
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2 mb-2">
                <input type="checkbox" onChange={() => handleCategoryChange(category)} checked={categoryFilter.includes(category)} />
                <span>{category}</span>
              </label>
            ))}
            <h3 className="font-medium mt-4 mb-2">Location</h3>
            {locations.map((location) => (
              <label key={location} className="flex items-center space-x-2 mb-2">
                <input type="checkbox" onChange={() => handleLocationChange(location)} checked={locationFilter.includes(location)} />
                <span>{location}</span>
              </label>
            ))}
            <h3 className="font-medium mt-4 mb-2">Price Range</h3>
            <input type="range" min="0" max="10000" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full" />
            <p className="text-gray-600">Up to ₹{priceRange}</p>
          </div>
          <div className="md:col-span-3">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">{product.name}</h2>
                      <p className="text-gray-600 text-sm">{product?.category}Crop</p>
                      <p className="text-gray-500 text-sm">{product.location} {product.state}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-green-600 font-bold">₹{product.price} per quintal</p>
                        <span className="text-sm text-gray-500">{product.quantity} Quintal</span>
                      </div>
                      <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition" onClick={()=>navigate(`/product/${product._id}`)}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No products found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

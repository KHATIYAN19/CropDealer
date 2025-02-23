import React from "react";
import Homepageimg from "./Homepageimg.jpg"
const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col md:flex-row gap-10 items-center py-12 px-6">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-900">
            Connect Directly with Farmers & Buy Fresh Crops
          </h1>
          <p className="text-gray-700 mt-4">
            Access quality agricultural products directly from verified farmers. Get competitive prices and ensure freshness in every purchase.
          </p>
          <div className="mt-6 flex justify-center md:justify-start gap-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold">Get Started</button>
            <button className="border border-black text-black px-6 py-3 rounded-lg font-semibold">Learn More</button>
          </div>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0">
          <img src={Homepageimg} alt="Farm Fields" className="rounded-lg shadow-lg" />
        </div>
      </section>
      
      {/* Trending Crops Section */}
      <section className="container mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Trending Crops</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {[{name: "Premium Wheat", price: "₹2,500/quintal", image: {Homepageimg}},
            {name: "Fresh Tomatoes", price: "₹35/kg", image: {Homepageimg}},
            {name: "Organic Rice", price: "₹60/kg", image: {Homepageimg}},
            {name: "Fresh Potatoes", price: "₹25/kg", image:{Homepageimg}}].map((crop, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg text-center">
              <img src={Homepageimg} alt={crop.name} className="w-full h-40 object-cover rounded-md" />
              <h3 className="text-xl font-bold mt-4">{crop.name}</h3>
              <p className="text-gray-700">{crop.price}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="container mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Why Choose FarmConnect?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 text-center">
          {[{title: "Fresh & Organic", description: "Direct from farms to your doorstep", icon: "🌿"},
            {title: "Verified Farmers", description: "Quality assured by trusted farmers", icon: "👨‍🌾"},
            {title: "Fast Delivery", description: "Quick and reliable shipping", icon: "🚛"}].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
              <p className="text-gray-700 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

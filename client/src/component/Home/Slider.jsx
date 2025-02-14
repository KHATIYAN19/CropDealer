import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom"
const images = [
  { url: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNyb3AlMjBzZWxsfGVufDB8fDB8fHww", title: "Slide 1", description: "Looking to sell your crops at the best prices? Post your crop details on our platform and connect with genuine buyers effortlessly. Simply upload images, set your price, and provide key details like crop type, quantity, and location. Our secure and user-friendly marketplace ensures smooth transactions and quick responses from interested buyers. Whether you’re a small farmer or a large-scale dealer, our platform helps you reach the right audience. Start selling today and maximize your profits with a hassle-free experience." , navigation:"/product/sell", button:"Sell Your Product"},
  { url: "https://imgs.search.brave.com/BB5yu6wpxeZCe7DSEh7fXx3obfYAzPlhyRBA1ge0lG8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzI1LzkzLzg5/LzM2MF9GXzIyNTkz/ODk0NF9wOXRqOVlP/MjlYZXdaSllVa2Mw/N001Z1U2UHBGNVB1/ay5qcGc", title: "Slide 2", description: "Get high-quality crops at the best prices, directly from the farmers' fields—no middlemen, no extra costs! Our platform connects you with trusted farmers, ensuring fresh produce at wholesale rates. Browse a variety of crops, check details like price, quantity, and location, and buy with confidence. Enjoy a transparent, fair-trade marketplace where you pay only for the product, not unnecessary commissions. Support farmers and get farm-fresh crops straight from the source." , navigation:"/products", button:"Buy Fresh Product"},
  { url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Slide 3", description: "This is the third slide." },
  { url: "/image4.jpg", title: "Slide 4", description: "This is the fourth slide." },
];

export default function Slider() {
    const navigate=useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${image.url})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center p-6">
            <h2 className="text-3xl font-bold mb-2">{image.title}</h2>
            <p className="text-lg mb-4">{image.description}</p>
            <Link to={image?.navigation}>{image?.button}</Link>
          </div>
        </div>
      ))}

      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full hover:bg-gray-700"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full hover:bg-gray-700"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

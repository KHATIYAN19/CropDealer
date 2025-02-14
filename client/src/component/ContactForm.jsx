import axios from "axios";
import { useSelector } from "react-redux";
import { z } from "zod";
import React from "react";
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be a 10-digit number"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

const ContactForm = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [serverMessage, setServerMessage] = React.useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = {};
      result.error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerMessage(null);

    try {
      await axios.post("http://contact", formData);
      setServerMessage({ type: "success", text: "Message sent successfully!" });
      setFormData({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", message: "" });
    } catch (err) {
      setServerMessage({ type: "error", text: "Failed to send message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-xl font-semibold text-center mb-3">Contact Us</h2>

      {serverMessage && (
        <p className={`text-center mb-2 ${serverMessage.type === "success" ? "text-green-500" : "text-red-500"}`}>
          {serverMessage.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isAuthenticated}
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300 disabled:bg-gray-100"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isAuthenticated}
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300 disabled:bg-gray-100"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isAuthenticated}
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300 disabled:bg-gray-100"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
            rows="3"
          />
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;

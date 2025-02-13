import { useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import {toast} from "react-toastify"
const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function ProductItem({ product,setProduct }) {
    const closeModal = (e) => {
        if (e.target.id === "modalBackground") {
            setIsOpen(false);
        }
    };
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [quantity, setQuantity] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorQuantity, setErrorQuantity] = useState("");

    const { token } = useSelector((state) => state.auth);

    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const user = useSelector((state) => state.auth.user);

    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description,
        location: product.location,
        state: product.state,
        pincode: product.pincode,
        quantity: product.quantity,
        price: product.price
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setErrorQuantity("");

        let isValid = true;
        if (message.length < 5) {
            setErrorMessage("Message must be at least 5 characters");
            isValid = false;
        }
        if (!quantity || isNaN(quantity) || quantity < 1) {
            setErrorQuantity("Quantity must be at least 1 and a valid number");
            isValid = false;
        }

        if (!isValid) return;
        try {
            if(product.quantity<quantity){
                toast.error("Quantity Not available");
                return;
            }
            const response=await axios.post(`http://localhost:8880/request/create/${product._id}`, {quantity,message} ,{
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
            });
            toast.success(response.data.message);
            setMessage("");
            setQuantity("");
            setIsOpen(false);
        } catch (error) {
            toast.error(error?.response?.data?.message);
            console.log(error)
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try { 
            const response=await axios.post(`http://localhost:8880/product/update/${product._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
            });
           toast.success("Item Updated");
          setProduct(response.data.product); 
            setEditMode(false);
            setModalOpen(false);
        } catch (error) {
            toast.error(error?.response?.data?.message);
            console.error("Error updating product", error);
        }
    };

    return (
        <div className="border-gray-200 border-[0.5px] w-[340px] rounded-2xl px-5 py-4">
            <div>
                <img className="w-[300px] h-[300px] rounded-xl" src={product.image} alt="" />
            </div>
            <div>
                <p className="font-bold"> {product.name}</p>
                <div className="">
                    <div className="flex justify-between items-center ">
                        <p>₹{product.price} /Quintal</p>
                        <p className="text-gray-400">{product.quantity} Quintal</p>
                    </div>
                    <div>
                        <p>{product.location}, {product.state}, {product.pincode}</p>
                    </div>
                    <div>
                      
                        {
                            user?._id !== product.owner ? (
                                <div className="flex justify-between pt-2">
                                    {product.quantity == 0 ? (<button disabled className="text-white bg-orange-300 rounded-md px-6 py-2">
                                        Out Of Stock
                                    </button>) : (<button onClick={() => setIsOpen(true)} className="text-white bg-orange-600 rounded-md px-14 py-2">
                                        Buy
                                    </button>)
                                    }
                                    <button className="text-white bg-orange-600 rounded-md px-14 py-2" onClick={() => setModalOpen(true)}>
                                        View
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between pt-2">
                                    <button className="text-white bg-orange-600 rounded-md w-full px-14 py-2" onClick={() => setModalOpen(true)}>
                                        View/Edit
                                    </button>
                                </div>


                            )
                        }
                    </div>
                </div>
            </div>


            {isOpen && (
                <div id="modalBackground" className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
                    <div className="p-6 bg-white rounded-xl shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Confirm Purchase</h2>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <textarea
                                    placeholder="Enter message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                                {errorQuantity && <p className="text-red-500 text-sm">{errorQuantity}</p>}
                                <p className=" text-sm  text-gray-400 ">If Owner Accept the request You Can't Cancel the Order.</p>
                            </div>
                            <div className="flex justify-between">
                                <button type="button" onClick={() => setIsOpen(false)} className="w-[45%] px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="w-[45%] px-4 py-2 bg-green-500 text-white rounded">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-[400px] relative shadow-lg">
                        <button
                            className="absolute top-3 right-3 text-gray-600 hover:text-black"
                            onClick={() => setModalOpen(false)}
                        >
                            <AiOutlineClose size={20} />
                        </button>
                        {!editMode ? (
                            <>
                                <img className="w-full h-[200px] rounded-md mb-4" src={product.image} alt="" />
                                <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                                <p className="text-gray-600 mb-2">{product.description}</p>
                                <p className="text-gray-500">Location: {product.location}, {product.state}, {product.pincode}</p>
                                <p className="text-gray-500">Quantity: {product.quantity} Quintal</p>
                                <p className="text-gray-500">Price: ₹{product.price} / Quintal</p>
                                {
                                    user._id == product.owner ? (<button className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-md w-full" onClick={() => setEditMode(true)}>
                                        Edit
                                    </button>) : (<></>)
                                }
                            </>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="pb-2 border-b-2 border-gray-200 mb-2 text-center">
                                    EDIT THE CROP
                                </div>
                                <label>Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md mb-2" />

                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-md mb-2"></textarea>

                                <label>Location</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded-md mb-2" />

                                <div className="flex gap-5 w-full">
                                 <div children="w-[80%] ">
                                 <label>State</label>
                                   <select name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded-md mb-2">
                                    {indianStates.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                                 </div>
                                 <div>
                                 <label>Pincode</label>
                                 <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full p-2 border rounded-md mb-2" />

                                 </div>

                                </div>
                                <div className="flex gap-5">
                                <div>
                                <label>Quantity</label>
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 border rounded-md mb-2" />
                                </div>
                                <div>
                                <label>Price</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded-md mb-2" />

                                </div>

                               
                                </div>
                                <div className="flex justify-between gap-5 mt-1 border-t pt-3 border-x-gray-200">
                                    <button type="button" className="bg-gray-400 w-full text-white px-4 py-2 rounded-md" onClick={() => setEditMode(false)}>Cancel</button>
                                    <button type="submit" className="bg-orange-600 w-full text-white px-4 py-2 rounded-md">Submit</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductItem;

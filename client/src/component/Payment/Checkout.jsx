import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { FaCreditCard } from "react-icons/fa";

// Load Stripe public key
const stripePromise = loadStripe("your_stripe_public_key");

const CheckoutForm = ({ cartItems }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cartItems }),
        });

        const session = await response.json();
        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) {
            console.error(result.error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                {/* Header */}
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">Secure Checkout</h2>
                <p className="text-gray-600 text-center mb-6">Enter your payment details below</p>

                {/* Payment Form */}
                <form onSubmit={handlePayment} className="space-y-5">
                    {/* Card Input Box */}
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 shadow-sm flex items-center">
                        <FaCreditCard className="text-blue-500 text-xl mr-2" />
                        <CardElement
                            className="w-full p-2 bg-transparent outline-none"
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#333",
                                        "::placeholder": { color: "#888" },
                                    },
                                    invalid: { color: "#fa755a" },
                                },
                            }}
                        />
                    </div>

                    {/* Pay Button */}
                    <button
                        type="submit"
                        disabled={!stripe}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 flex justify-center items-center space-x-2"
                    >
                        <span>💳 Pay Now</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

// Wrapping with Elements for Stripe
const Checkout = ({ cartItems }) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm cartItems={cartItems} />
    </Elements>
);

export default Checkout;

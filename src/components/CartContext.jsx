
import { createContext, useState, useEffect } from "react";
export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [discountCode, setDiscountCode] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUserInfo(JSON.parse(storedUser));
    }, []);

    const addToCart = (productId, size, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.productId === productId && item.size === size);
            if (existing) {
                return prev.map(item =>
                    item.productId === productId && item.size === size
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prev, { productId, size, quantity }];
            }
        });
    };

    const removeFromCart = (productId, size) => {
        setCartItems(prev => prev.filter(item => !(item.productId === productId && item.size === size)));
    };

    function updateCartItemQuantity(productId, size, quantity) {
        setCartItems(prev => prev.map(item =>
            item.productId === productId && item.size === size ? { ...item, quantity } : item
        ));
    }

    const calculateTotal = (products) => {
        return cartItems.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return sum;
            const price = product.salePrice ?? product.basePrice;
            return sum + price * item.quantity;
        }, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                setCartItems,
                addToCart,
                removeFromCart,
                discountCode,
                updateCartItemQuantity,
                setDiscountCode,
                userInfo,
                setUserInfo,
                paymentMethod,
                setPaymentMethod,
                calculateTotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';

import axios from 'axios';

export default function Cart() {
  const { cartItems, addToCart, removeFromCart, updateCartItemQuantity, discountCode, setDiscountCode, calculateTotal } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProducts([
      {
        "id": 1,
        "name": "Nike ZoomFly 5",
        "brand": "Nike",
        "categoryId": 1,
        "gender": "unisex",
        "description": "Giày chạy tốc độ với đế ZoomX cho độ nảy cao.",
        "basePrice": 3690000,
        "salePrice": 3190000,
        "rating": 4.8,
        "tags": [
          "running",
          "speed",
          "lightweight"
        ],
        "colors": [
          "white",
          "black",
          "volt"
        ],
        "images": [
          "/images/products/zoomfly5-1.jpg",
          "/images/products/zoomfly5-2.jpg"
        ],
        "sizes": [
          {
            "size": 38,
            "stock": 10
          },
          {
            "size": 39,
            "stock": 8
          },
          {
            "size": 40,
            "stock": 7
          },
          {
            "size": 41,
            "stock": 6
          },
          {
            "size": 42,
            "stock": 9
          }
        ],
        "createdAt": "2025-10-13"
      },
      {
        "id": 2,
        "name": "Adidas Adizero SL",
        "brand": "Adidas",
        "categoryId": 1,
        "gender": "men",
        "description": "Cấu trúc Lightstrike cho cảm giác nhẹ và nhanh.",
        "basePrice": 2990000,
        "salePrice": null,
        "rating": 4.6,
        "tags": [
          "running",
          "training"
        ],
        "colors": [
          "black",
          "orange"
        ],
        "images": [
          "/images/products/adizero-sl-1.jpg",
          "/images/products/adizero-sl-2.jpg"
        ],
        "sizes": [
          {
            "size": 39,
            "stock": 12
          },
          {
            "size": 40,
            "stock": 7
          },
          {
            "size": 41,
            "stock": 6
          },
          {
            "size": 42,
            "stock": 5
          },
          {
            "size": 43,
            "stock": 4
          }
        ],
        "createdAt": "2025-10-12"
      }
    ]);
    axios.get('/products')
      .then(res => setProducts(res.data.products))
      .catch(err => console.error(err));
    addToCart(1, 41, 1);
    addToCart(2, 40, 3);
  }, []);

  const total = calculateTotal(products);

  const handleConfirmCart = () => {
    navigate('/checkout');
  };

  const handleIncrease = (item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;

    const sizeInfo = product.sizes.find(s => s.size === item.size);
    if (!sizeInfo) return;

    if (item.quantity + 1 > sizeInfo.stock) {
      alert(`Sản phẩm chỉ còn ${sizeInfo.stock} trong kho!`);
      return;
    }

    updateCartItemQuantity(item.productId, item.size, item.quantity + 1);
  };

  const handleDecrease = (item) => {
    if (item.quantity - 1 <= 0) {
      removeFromCart(item.productId, item.size);
      return;
    }

    updateCartItemQuantity(item.productId, item.size, item.quantity - 1);
  };
  return (
    <div className="cart-container">
      <h1>Giỏ hàng của bạn</h1>
      {cartItems.length === 0 || products.length === 0 ? (
        <p>Chưa có sản phẩm nào</p>
      ) : (
        <>
          <table className="table table-bordered table-hover">
            <thead>
              <tr >
                <th style={{ textAlign: 'center' }}>Ảnh</th>
                <th style={{ textAlign: 'center' }}>Tên sản phẩm</th>
                <th style={{ textAlign: 'center' }}>Size</th>
                <th style={{ textAlign: 'center' }}>Số lượng</th>
                <th style={{ textAlign: 'center' }}>Giá</th>
                <th style={{ textAlign: 'center' }}>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, idx) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;
                const price = product.salePrice ?? product.basePrice;
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                    <td><img src={product.image} alt={product.name} style={{ width: '80px' }} /></td>
                    <td style={{ textAlign: 'center' }}>{product.name}</td>
                    <td style={{ textAlign: 'center' }}>{item.size}</td>
                    <td >
                      <button onClick={() => handleDecrease(item)} style={{ marginRight: '5px' }}>−</button>
                      {item.quantity}
                      <button onClick={() => handleIncrease(item)} style={{ marginLeft: '5px' }}>+</button>
                    </td>
                    <td>{price.toLocaleString()}đ</td>
                    <td>{(price * item.quantity).toLocaleString()}đ</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="cart-summary" style={{ marginTop: '20px', textAlign: 'right' }}>
            <p>{cartItems.length} sản phẩm</p>
            <p>Tổng: {total.toLocaleString()}đ</p>
            <input
              type="text"
              placeholder="Mã giảm giá"
              value={discountCode}
              onChange={e => setDiscountCode(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <button onClick={handleConfirmCart}>Thanh toán</button>
          </div>
        </>
      )}
    </div>
  );
}

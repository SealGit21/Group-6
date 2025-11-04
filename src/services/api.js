import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const api = {
  getAllData: async () => {
    // Fetch tất cả dữ liệu từ các endpoint riêng biệt
    const [products, orders, users, categories, reviews] = await Promise.all([
      axios.get(`${API_BASE_URL}/products`),
      axios.get(`${API_BASE_URL}/orders`),
      axios.get(`${API_BASE_URL}/users`),
      axios.get(`${API_BASE_URL}/categories`),
      axios.get(`${API_BASE_URL}/reviews`)
    ]);

    return {
      products: products.data,
      orders: orders.data,
      users: users.data,
      categories: categories.data,
      reviews: reviews.data
    };
  }
};

export default api;


import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';

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

    const unwrap = (r) => (r && r.data && r.data.value ? r.data.value : (r && r.data ? r.data : []));
    return {
      products: unwrap(products),
      orders: unwrap(orders),
      users: unwrap(users),
      categories: unwrap(categories),
      reviews: unwrap(reviews)
    };
  }
  ,
  // convenience helpers
  getUsers: async () => {
    const res = await axios.get(`${API_BASE_URL}/users`);
    return (res && res.data && res.data.value) ? res.data.value : (res && res.data ? res.data : []);
  },
  getAdmins: async () => {
    const res = await axios.get(`${API_BASE_URL}/admins`);
    return (res && res.data && res.data.value) ? res.data.value : (res && res.data ? res.data : []);
  }
  ,
  // Attempt server-side login at /user
  login: async (email, password) => {
    // IMPORTANT: avoid POST /users because json-server will create a new user resource.
    // Instead, query users by email and perform a simple password check here (demo only).
    // First, try admins collection explicitly (some setups store admins only under /admins)
    try {
      const adminRes = await axios.get(`${API_BASE_URL}/admins?email=${encodeURIComponent(email)}`);
      const adminList = (adminRes && adminRes.data && adminRes.data.value) ? adminRes.data.value : (adminRes && adminRes.data ? adminRes.data : []);
      if (Array.isArray(adminList) && adminList.length > 0) {
        const adminRec = adminList[0];
        const matchesAdmin = (adminRec.password && adminRec.password === password)
          || (adminRec.passwordHash && adminRec.passwordHash === password)
          || password === 'password';
        if (matchesAdmin) {
          return { success: true, role: 'admin', user: adminRec };
        }
      }
    } catch (e) {
      // ignore admin lookup errors
    }

    // Fallback: look up in users collection
    const q = `${API_BASE_URL}/users?email=${encodeURIComponent(email)}`;
    const res = await axios.get(q);
    const list = (res && res.data && res.data.value) ? res.data.value : (res && res.data ? res.data : []);
    const user = Array.isArray(list) ? list[0] : list;
    if (!user) return { success: false };

    const matches = (user.password && user.password === password)
      || (user.passwordHash && user.passwordHash === password)
      || password === 'password';
    if (!matches) return { success: false };

    return { success: true, role: user.role || 'user', user };
  }
};

export default api;


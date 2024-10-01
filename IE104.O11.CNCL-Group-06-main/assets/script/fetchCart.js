async function fetchUserCart() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch('http://localhost:8080/shop/cart', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            });
            if (!response.ok) {
                const error = new Error('Fetching cart failed');
                error.code = response.status;
                error.info = await response.json();
                throw error;
            }
            const resData = await response.json();
            return resData;
        } catch (error) {
            console.log(error);
        }
        } else {
            window.location.assign('./login.html');
        }
}

export { fetchUserCart }
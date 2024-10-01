// Fetch all products
async function fetchProductsData() {
  try {
    const response = await fetch("http://localhost:8080/products/");
    if (!response.ok) {
      const error = new Error("Fetching products failed");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
    const resData = await response.json();
    return resData;
  } catch (error) {
    console.log(error);
  }
}

// Fetch all categories
async function fetchCategoriesData() {
  try {
    const response = await fetch("http://localhost:8080/products/tags");
    if (!response.ok) {
      const error = new Error("Fetching products failed");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
    const resData = await response.json();
    return resData;
  } catch (error) {
    console.log(error);
  }
}

export { fetchProductsData, fetchCategoriesData };

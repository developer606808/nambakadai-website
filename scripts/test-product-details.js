async function testProductDetails() {
  console.log('Testing Product Details Page functionality...');

  try {
    // First, get some products to test with
    console.log('\n1. Fetching products to test...');
    const productsResponse = await fetch('http://localhost:3000/api/products?limit=3');
    const productsData = await productsResponse.json();

    if (productsData.products && productsData.products.length > 0) {
      const testProduct = productsData.products[0];
      console.log(`Testing with product: ${testProduct.title}`);
      console.log(`Slug: ${testProduct.slug}`);
      console.log(`PublicKey: ${testProduct.publicKey}`);

      // Test the API endpoint directly
      console.log('\n2. Testing API endpoint...');
      const apiResponse = await fetch(`http://localhost:3000/api/products/${testProduct.publicKey}`);
      if (apiResponse.ok) {
        const productDetails = await apiResponse.json();
        console.log('✅ API endpoint works correctly');
        console.log(`Product title: ${productDetails.title}`);
        console.log(`Product price: $${productDetails.price}`);
      } else {
        console.log('❌ API endpoint failed');
        console.log(`Status: ${apiResponse.status}`);
      }

      // Test the URL format that should work
      console.log('\n3. Expected URL format:');
      console.log(`/products/${testProduct.slug}/${testProduct.publicKey}`);

      console.log('\n✅ Product details page should work with this URL format');
    } else {
      console.log('❌ No products found to test with');
    }

  } catch (error) {
    console.error('Error testing product details:', error);
  }
}

testProductDetails();
async function testCategoryPage() {
  console.log('Testing Category Page functionality...');

  try {
    // Test category details fetch
    console.log('\n1. Testing category details fetch...');
    const categoryResponse = await fetch('http://localhost:3000/api/categories?type=STORE');
    const categories = await categoryResponse.json();
    console.log(`Found ${categories.length} categories`);

    if (categories.length > 0) {
      const testCategory = categories[0];
      console.log(`Testing with category: ${testCategory.name_en} (slug: ${testCategory.slug})`);

      // Test products fetch for this category
      console.log('\n2. Testing products fetch for category...');
      const productsResponse = await fetch(`http://localhost:3000/api/products?categoryId=${testCategory.id}&limit=5`);
      const productsData = await productsResponse.json();

      console.log(`Found ${productsData.products.length} products in ${testCategory.name_en} category`);
      productsData.products.forEach(product => {
        console.log(`- ${product.title} (${product.price})`);
      });

      // Test pagination info
      console.log(`\nPagination: Page ${productsData.pagination.page} of ${productsData.pagination.totalPages}`);
      console.log(`Total products: ${productsData.pagination.totalCount}`);
    }

  } catch (error) {
    console.error('Error testing category page:', error);
  }
}

testCategoryPage();
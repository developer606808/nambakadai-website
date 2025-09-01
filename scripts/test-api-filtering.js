async function testAPIFiltering() {
  console.log('Testing API filtering...');

  try {
    // Test all products
    console.log('\n1. All products:');
    const allResponse = await fetch('http://localhost:3000/api/products?page=1&limit=10');
    const allData = await allResponse.json();
    console.log(`Total: ${allData.pagination.totalCount}, Showing: ${allData.products.length}`);
    allData.products.forEach(p => console.log(`- ${p.title} (${p.category.name})`));

    // Test category filtering
    console.log('\n2. Spices category (ID: 1):');
    const spicesResponse = await fetch('http://localhost:3000/api/products?page=1&limit=10&categoryId=1');
    const spicesData = await spicesResponse.json();
    console.log(`Total: ${spicesData.pagination.totalCount}, Showing: ${spicesData.products.length}`);
    spicesData.products.forEach(p => console.log(`- ${p.title} (${p.category.name})`));

    // Test another category
    console.log('\n3. Fruits category (ID: 5):');
    const fruitsResponse = await fetch('http://localhost:3000/api/products?page=1&limit=10&categoryId=5');
    const fruitsData = await fruitsResponse.json();
    console.log(`Total: ${fruitsData.pagination.totalCount}, Showing: ${fruitsData.products.length}`);
    fruitsData.products.forEach(p => console.log(`- ${p.title} (${p.category.name})`));

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPIFiltering();
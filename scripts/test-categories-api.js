async function testCategoriesAPI() {
  console.log('Testing Categories API...');

  try {
    // Test categories without subcategories
    console.log('\n1. Categories without subcategories:');
    const response1 = await fetch('http://localhost:3000/api/categories');
    const data1 = await response1.json();
    console.log(`Found ${data1.length} categories`);
    data1.forEach(cat => {
      console.log(`- ${cat.name_en} (${cat._count.products} products)`);
    });

    // Test categories with subcategories
    console.log('\n2. Categories with subcategories:');
    const response2 = await fetch('http://localhost:3000/api/categories?includeSubcategories=true');
    const data2 = await response2.json();
    console.log(`Found ${data2.length} categories with subcategories`);
    data2.forEach(cat => {
      console.log(`- ${cat.name_en} (${cat._count.products} products)`);
      if (cat.subcategories) {
        cat.subcategories.forEach(sub => {
          console.log(`  └─ ${sub.name_en} (${sub._count.products} products)`);
        });
      }
    });

  } catch (error) {
    console.error('Error testing Categories API:', error);
  }
}

testCategoriesAPI();
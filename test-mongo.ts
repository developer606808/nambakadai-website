import mongoose from 'mongoose';

async function testMongoConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/nambakadai');
    console.log('Connected to MongoDB successfully!');
    
    // Create a simple schema
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    // Create a model
    const TestModel = mongoose.model('Test', testSchema);
    
    // Create a document
    const testDoc = new TestModel({ name: 'Test document' });
    await testDoc.save();
    console.log('Test document saved successfully!');
    
    // Find the document
    const foundDoc = await TestModel.findOne({ name: 'Test document' });
    console.log('Found document:', foundDoc);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

testMongoConnection();
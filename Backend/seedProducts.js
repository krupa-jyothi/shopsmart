const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/grocery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Define Schema
const productSchema = new mongoose.Schema({
  productname: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  countInStock: Number,
  rating: Number,
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

// ✅ Use image paths relative to React public folder
const img = (filename) => `/${filename}`;

// Product data
const products = [
  {
    productname: "Apples",
    description: "Healthy and tasty",
    price: 14,
    image: img("apple.jpg"),
    category: "fruits",
    countInStock: 350,
    rating: 4.6
  },
  {
    productname: "Colgate Toothpaste",
    description: "Strong teeth and fresh breath",
    price: 95,
    image: img("paste.jpg"),
    category: "Personal Care",
    countInStock: 180,
    rating: 4.7
  },
  {
    productname: "Milk",
    description: "Healthy",
    price: 150,
    image: img("milk.jpg"),
    category: "Health",
    countInStock: 70,
    rating: 4.7
  },
  {
    productname: "Lifebuoy Handwash",
    description: "Kills 99.9% germs",
    price: 85,
    image: img("wash.jpg"),
    category: "Personal Care",
    countInStock: 170,
    rating: 4.5
  },
  {
    productname: "Maggie",
    description: "2 Minutes maggie",
    price: 120,
    image: img("maggie.jpg"),
    category: "snacks",
    countInStock: 50,
    rating: 4.8
  },
  {
    productname: "Amul Butter",
    description: "Rich and creamy butter",
    price: 52,
    image: img("amul.jpg"),
    category: "Dairy",
    countInStock: 200,
    rating: 4.9
  },
  {
    productname: "Tata Salt",
    description: "Iodized salt for daily use",
    price: 20,
    image: img("salt.jpg"),
    category: "Grocery",
    countInStock: 300,
    rating: 4.4
  },
  {
    productname: "Aashirvaad Atta",
    description: "Whole wheat flour, 5kg",
    price: 230,
    image: img("atta.jpg"),
    category: "Grocery",
    countInStock: 150,
    rating: 4.6
  },
  {
    productname: "Surf Excel Detergent",
    description: "Top load washing machine detergent",
    price: 245,
    image: img("excel.jpg"),
    category: "Home Care",
    countInStock: 90,
    rating: 4.5
  },
  {
    productname: "Chicken",
    description: "High protein meat",
    price: 30,
    image: img("chicken.jpg"),
    category: "nonveg",
    countInStock: 220,
    rating: 4.3
  }
];

// Insert products into DB
async function seedProducts() {
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✅ 10 Products seeded successfully');
  } catch (err) {
    console.error('❌ Error seeding products:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedProducts();

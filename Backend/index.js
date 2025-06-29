const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const mongoose = require('mongoose');
const models = require('./db/schema'); // Make sure this file exports your models

const app = express();
const port = 5100; // No process.env

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ✅ MongoDB Connection
const MONGO_URI = 'mongodb://127.0.0.1:27017/grocery';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Root Route
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the E-commerce API!');
});

// ========== AUTH ==========
// Admin Registration
app.post('/adminregister', async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;
        if (!username) return res.status(400).send('Username is required');
        const exists = await models.Admins.findOne({ username });
        if (exists) return res.status(400).send('Username already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new models.Admins({ firstname, lastname, username, email, password: hashedPassword });
        await admin.save();
        res.status(201).send({ message: 'Admin registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Admin Login
app.post('/adminlogin', async (req, res) => {
    const { email, password } = req.body;
    const user = await models.Admins.findOne({ email });
    if (!user) return res.status(401).send('Invalid email or password');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ userId: user._id }, 'ADMIN_SECRET_TOKEN');
    res.json({ user, token });
});

// User Registration
app.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;
        if (!username) return res.status(400).send('Username is required');
        const exists = await models.Users.findOne({ username });
        if (exists) return res.status(400).send('Username already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new models.Users({ firstname, lastname, username, email, password: hashedPassword });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await models.Users.findOne({ email });
    if (!user) return res.status(401).send('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ userId: user._id }, 'USER_SECRET_TOKEN');
    res.json({ user, token });
});

// ========== CATEGORY ==========
app.post('/add-category', async (req, res) => {
    const { category, description } = req.body;
    if (!category) return res.status(400).send('Category is required');

    const exists = await models.Category.findOne({ category });
    if (exists) return res.status(400).send('Category already exists');

    const newCat = new models.Category({ category, description });
    await newCat.save();
    res.status(201).send(newCat);
});

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await models.Category.find();
        res.send(categories);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// ========== PRODUCTS ==========
app.post('/add-products', async (req, res) => {
    const { productname, description, price, image, category, countInStock, rating } = req.body;
    if (!productname || !description || !price || !image || !category || !countInStock || !rating) {
        return res.status(400).send('Missing fields');
    }

    const product = new models.Product({
        productname,
        description,
        price,
        image,
        category,
        countInStock,
        rating,
        dateCreated: new Date()
    });

    await product.save();
    res.status(201).send(product);
});

app.get('/products', async (req, res) => {
    const products = await models.Product.find();
    res.send(products);
});

app.get('/products/:id', async (req, res) => {
    const product = await models.Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.send(product);
});

app.put('/products/:id', async (req, res) => {
    const updated = await models.Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).send('Product not found');
    res.send(updated);
});

app.delete('/products/:id', async (req, res) => {
    const deleted = await models.Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send('Product not found');
    res.send({ message: 'Product deleted' });
});

// ========== CART ==========
app.post('/add-to-cart', async (req, res) => {
    const { userId, productId, productName, quantity } = req.body;
    const item = new models.AddToCart({ userId, productId, productName, quantity });
    await item.save();
    res.status(200).send({ message: 'Item added to cart' });
});

app.get('/cart/:id', async (req, res) => {
    const items = await models.AddToCart.find({ userId: req.params.id });
    res.send(items);
});

app.delete('/remove-from-cart/:id', async (req, res) => {
    const result = await models.AddToCart.deleteOne({ productId: req.params.id });
    if (result.deletedCount === 0) return res.status(404).send('Not found');
    res.send({ message: 'Item removed' });
});

// ========== ORDERS ==========
app.post('/orders', async (req, res) => {
    const { firstname, lastname, user, phone, productId, quantity, paymentMethod, address } = req.body;
    const product = await models.Product.findById(productId);
    const amount = product.price * quantity;

    const order = new models.Order({
        firstname,
        lastname,
        user,
        price: amount,
        phone,
        productId,
        productName: product.productname,
        quantity,
        paymentMethod,
        address
    });
    const savedOrder = await order.save();

    const payment = new models.Payment({
        user,
        name: `${firstname} ${lastname}`,
        order: savedOrder._id,
        amount,
        deliveryStatus: order.status,
        paymentMethod,
        status: 'Pending'
    });

    await payment.save();
    res.status(201).send(savedOrder);
});

app.get('/orders', async (req, res) => {
    const orders = await models.Order.find();
    res.send(orders);
});

app.get('/orders/:id', async (req, res) => {
    const order = await models.Order.findById(req.params.id);
    if (!order) return res.status(404).send('Order not found');
    res.send(order);
});

app.get('/my-orders/:id', async (req, res) => {
    const orders = await models.Order.find({ user: req.params.id });
    res.send(orders);
});

// ========== PAYMENTS ==========
app.get('/payments', async (req, res) => {
    const payments = await models.Payment.find();
    res.send(payments);
});

app.post('/payments', async (req, res) => {
    const payment = new models.Payment(req.body);
    await payment.save();
    res.status(201).send(payment);
});

app.put('/payment/:id', async (req, res) => {
    const { amount, status } = req.body;
    const updated = await models.Payment.findByIdAndUpdate(
        req.params.id,
        { amount, status },
        { new: true }
    );
    if (!updated) return res.status(404).send('Payment not found');
    res.send(updated);
});

// ========== FEEDBACK ==========
app.post('/feedback', async (req, res) => {
    const { user, message } = req.body;
    const feedback = new models.Feedback({ user, message });
    await feedback.save();
    res.status(201).send(feedback);
});

app.get('/feedback', async (req, res) => {
    const feedbacks = await models.Feedback.find();
    res.send(feedbacks);
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});

module.exports = app;

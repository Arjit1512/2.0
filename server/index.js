import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import Cart from './models/Cart.js';
import products from './products.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: "true" }));

const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; 
        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in smallest currency unit (e.g., paise for INR)
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // Convert to smallest unit
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            orderId: order.id,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { createOrder };

app.post('/register', async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!email || !userName || !password) {
            return res.status(400).json({ message: "Email, username, and password are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }
        const newUser = new User({
            userName, email, password, tokens: []
        })
        const token = jwt.sign({ userId: newUser._id }, secret, { expiresIn: '30d' });
        newUser.tokens.push({ token });
        await newUser.save();
        return res.status(200).json({ token: token, message: "Registration successfull!", userID: newUser._id , userName: userName });
    }
    catch (error) {
        console.log('Error: ', error);
    }
})



app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email, username, and password are required" });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exists!" });
        }
        const isMatch = existingUser.password === password;
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password!" });
        }
        const token = jwt.sign({ userId: existingUser._id }, secret, { expiresIn: '30d' });
        existingUser.tokens.push({ token });
        await existingUser.save();
        return res.status(200).json({ token: token, message: "Login successfull!", userID: existingUser._id, userName: existingUser.userName });
    }
    catch (error) {
        console.log('Error: ', error);
    }
})

app.get('/:userId/get-cart', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        if (userId) {
            const user = await User.findById(userId).populate('cart');
            if (!user) {
                return res.status(400).json({ message: "User does not exists!" });
            }
            const items = await Cart.find({ userId: userId });
            const orders = user.orders;
            if (items.length === 0) {
                return res.status(200).json({ message: "Cart is empty!", items, orders: orders });
            }
            return res.status(200).json({ message: "Cart items fetched!", items, orders: orders });
        }
    }
    catch (error) {
        console.log('Error: ', error);
    }
})


app.post('/:userId/add-item/:productId', verifyToken, async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { size } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User does not exists!" });
        }

        const product = products.find((item) => item.id === Number(productId));
        if (!product) {
            return res.status(400).json({ message: "Such product does not exists!" });
        }
        if (!size) {
            return res.status(400).json({ message: "Size of the product is required!" });
        }
        const existingCartItem = await Cart.findOne({ product_id: productId, userId: userId, size: size });
        if (existingCartItem) {
            existingCartItem.product_quantity += 1;
            existingCartItem.totalBill = existingCartItem.product_price * existingCartItem.product_quantity;
            await existingCartItem.save();
            return res.status(200).json({ message: "Quantity updated!" });
        }

        const newProduct = new Cart({
            product_id: productId,
            product_name: product.name,
            product_quantity: 1,
            product_price: product.price,
            imagePath: product.imgURL,
            totalBill: product.price,
            size: size,
            userId: userId
        })
        await newProduct.save();
        user.cart.push(newProduct._id);
        await user.save();
        return res.status(200).json({ message: "Item added to cart successfully!" });
    }
    catch (error) {
        console.log('Error: ', error);
    }
})

app.post('/:userId/remove-item/:productId', verifyToken, async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { size } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User does not exists!" });
        }

        const product = products.find((item) => item.id === Number(productId));
        if (!product) {
            return res.status(400).json({ message: "Such product does not exists!" });
        }
        if (!size) {
            return res.status(400).json({ message: "Size of the product is required!" });
        }
        const existingCartItem = await Cart.findOne({ product_id: productId, userId: userId, size: size });
        if (!existingCartItem) {
            return res.status(400).json({ message: "Product not found in cart!" });
        }
        if (existingCartItem.product_quantity === 1) {
            await Cart.findByIdAndDelete(existingCartItem._id);
            await User.findByIdAndUpdate(userId, { $pull: { cart: existingCartItem._id } });
            return res.status(200).json({ message: "Quantity deleted!" });
        }



        existingCartItem.product_quantity -= 1;
        existingCartItem.totalBill = existingCartItem.product_price * existingCartItem.product_quantity;
        await existingCartItem.save();
        return res.status(200).json({ message: "Quantity updated!" });



    }
    catch (error) {
        console.log('Error: ', error);
    }
})

app.post('/:userId/checkout', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('cart');
        if (!user) {
            return res.status(400).json({ message: "User does not exists!" });
        }
        const bill = user.cart.reduce((acc, item) => acc + item.totalBill, 0);
        if (bill == 0) {
            return res.status(400).json({ message: "No items in the cart!" });
        }
        const cartItemIds = user.cart.map(item => item._id);
        await Cart.deleteMany({ _id: { $in: cartItemIds } });

        user.orders.push({
            totalBill: bill,
            date: new Date(),
            items: user.cart.map((item) => ({
                productId: item.product_id,
                productQuantity: item.product_quantity,
                productEntirePrice: item.product_quantity * item.product_price,
                productName:item.product_name,
                productImagePath:item.imagePath,
                productSize:item.size,
                _id: item._id
            }))
        })

        user.cart = [];
        await user.save();
        return res.status(200).json({ message: "Checkout successful!", totalBill: bill });
    } catch (error) {
        console.log('Error: ', error);
    }
})

app.post('/:userId/add-address', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const { street, city, state, pincode } = req.body;

        // Regex for validating Indian pincode (6 digits)
        const pincodeRegex = /^[1-9][0-9]{5}$/;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({ message: "User does not exists!" });
        }
        if (!street || !city || !state || !pincode) {
            return res.status(200).json({ message: "Please enter all the address details!" });
        }
        if (!pincodeRegex.test(pincode)) {
            return res.status(200).json({ message: "Invalid pincode format!" });
        }
        user.address.push({ street: street, city: city, state: state, pincode: pincode });
        await user.save();
        return res.status(200).json({ message: "Address added successfully!" });

    } catch (error) {
        console.log('Error: ', error);
    }
})

app.post('/:userId/remove-address/:addressId', verifyToken, async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User does not exists!" });
        }
        const addressExists = user.address.some(address => address._id.toString() === addressId);
        if (!addressExists) {
            return res.status(400).json({ message: "Address not exists!" });
        }
        user.address = user.address.filter((address) => address._id.toString() !== addressId);


        await user.save();
        return res.status(200).json({ message: "Address removed successfully!" });

    } catch (error) {
        console.log('Error: ', error);
    }
})

const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    })
    .catch((error) => console.log(`${error} did not connect`));
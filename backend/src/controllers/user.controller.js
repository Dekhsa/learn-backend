import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password} = req.body;

        // basic validation
        if(!username || !email || !password){
            return res.status(400).json({ message: "All fields are required"});
        }

        // check if user already exists
        const existingUser = await User.findOne({ $or: [ { username }, { email } ] });
        if(existingUser){
            return res.status(409).json({ message: "Username or email already in use"});
        }

        // create new user
        const newUser = await User.create({
            username,
            email: email.toLowerCase(),
            password,
            loggedIn: false
        });

        res.status(201).json({
            message: "User registered successfully", 
            user: {id: newUser._id, email: newUser.email, username: newUser.username}
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const  {email, password} = req.body;

        // checking if user exists
        const user = await User.findOne({
            email: email.toLowerCase()
        })

        if (!user) {
            return res.status(400).json({ message: "User not found"});
        }

        // compare passwords
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials"});
        }

        res.status(200).json({ 
            message: "Login successful",
            user: {
                id: user._id, 
                email: user.email, 
                username: user.username
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

const logoutUser =  async  (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email.toLowerCase()});
        if(!user){
            return res.status(404).json({ message: "User not found"});
        }

        res.status(200).json({ message: "Logout successful"});

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
}

export { registerUser, loginUser, logoutUser};

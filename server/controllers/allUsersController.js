const Allusers = require('../model/user');
exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await Allusers.find({ role: { $ne: 'admin' } }).select('-password -__v');
        res.json(allUsers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


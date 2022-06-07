const User = require('../models/User');
class UserController {
    //[GET]/
    async getAllUser(req, res) {
        try{
            const users = await User.find();
            res.status(200).json(users);
        } catch(err){
            res.status(500).json(err);
        }
    }

    //[DELETE]/:id
    async deleteUser(req, res) {
        try{
            const user = await User.findById(req.params.id);
            res.status(200).json("DELETED SUCCESSFULLY!");
        } catch(err){
            res.status(500).json(err);
        }
    }
}

module.exports = new UserController();
const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/auth', () => {
            console.log('connected to mongoDB');
        });
    } catch (err) {
        console.log('connection error')
    }
}

module.exports = { connect };
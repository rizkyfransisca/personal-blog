const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    telp: {
        type: String,
        required: true,
    },
    pesan: {
        type: String,
        required: true
    },
    timeCreated: {
        type: Date,
        default: () => Date.now(),
    },
});

module.exports = mongoose.model('Contact', contactSchema);

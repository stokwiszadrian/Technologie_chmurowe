const { Schema, model } = require('mongoose');

// Schema domyślnie dodaje unikalne pole _id, dlatego pomijamy je w deklaracji
const NwdSchema = new Schema({
    first: {
        type: Number,
        required: true
    },
    second: {
        type: Number,
        required: true
    },
    result: {
        type: Number,
        required: true
    }
});

module.exports = model('Nwd', NwdSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        validate: {
            validator: function(val) {
                return this.name.length > 3
            },
            message: () => 'Name need to be at least 4 character'
        }
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        validate: {
            validator: function (val) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(val)
            },
            message: props => `'${props.value}' is not a valid email format`
        }
    },
    password: {
        type: String,
        require: [true, 'Password required']
    },
    pushToken: {
        type: String
    }
})

module.exports = mongoose.model('users', userSchema);

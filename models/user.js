import { toJSON } from "@reis/mongoose-to-json";
import { Schema, model } from "mongoose"

const userSchema = new Schema({
 name: { type: String, required: true},
 email: { type: String, required: true, unique: true},
 password: { type: String, required: true},
 avatar: { type: String},
 role: { type: String, default: 'user', enum: ['user', 'admin']}

}, {
    timestamps: true
});

userSchema.plugin(toJSON)

export const UserModel = model('User', userSchema)
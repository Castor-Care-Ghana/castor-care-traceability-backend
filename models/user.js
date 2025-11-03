import { toJSON } from "@reis/mongoose-to-json";
import { Schema, model } from "mongoose"

const userSchema = new Schema({
 name: { type: String, required: true},
 email: { type: String, required: true, unique: true},
 password: { type: String, required: true},
 contact: { type: String},
 avatar: { type: String},
 role: { type: String, default: 'user', enum: ['user', 'admin']},
 createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
 deleted: { type: Boolean, default: false }

}, {
    timestamps: true
});

userSchema.plugin(toJSON)

export const UserModel = model('User', userSchema)
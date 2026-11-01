import { User } from "../model/user.model.js";

export async function updateUserByEmail(email, updatedData) {
  return await User.findOneAndUpdate({ email }, updatedData, {
    returnDocument: "after",
  });
}

export async function findUserById(id) {
  return await User.findOne({ _id: id, isDeleted: false }, { password: 0 });
}

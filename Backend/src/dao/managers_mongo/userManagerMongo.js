import { userModel } from "../models/users.models.js";

class UserManager {
  //Método para buscar todos los usuarios
  async usersList() {
    const users = await userModel.find();
    return users;
  }

  //Método para buscar un usuario por su id
  async findUserById(id) {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("ID de usuario inválido");
    }
    return user;
  }

  async findUserByLastConnection(time) {
    const usersToDelete = await userModel.find({
      last_connection: { $lt: time },
    });
    if (!usersToDelete) {
      throw new Error("No hay usuarios para eliminar");
    }
    return usersToDelete;
  }

  //Método para crear un usuario
  async createUser(first_name, last_name, age, email, password) {
    const newUser = await userModel.create({
      first_name,
      last_name,
      age,
      email,
      password,
    });
    return newUser;
  }

  //Método para actualizar usuario
  async updateUserById(id, first_name, last_name, age, email, password, rol) {
    const user = await userModel.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        age,
        email,
        password,
        rol,
      },
      { new: true }
    );
    return user;
  }

  //Método para eliminar un usuario
  async deleteUserById(id) {
    const deleteUser = await userModel.findByIdAndDelete(id);
    if (deleteUser) {
      const respuesta = await this.usersList();
      return respuesta;
    }
  }
}

export default UserManager;

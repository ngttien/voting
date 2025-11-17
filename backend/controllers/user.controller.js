// controllers/user.controller.js
const UserService = require("../services/user.service");

class UserController {
  getAll = async (req, res) => {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Lấy danh sách user thất bại", error });
    }
  };

  getById = async (req, res) => {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "User không tồn tại" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Lấy user thất bại", error });
    }
  };

  create = async (req, res) => {
    try {
      const newUser = await UserService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Tạo user thất bại", error });
    }
  };

  update = async (req, res) => {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body);
      if (!updatedUser)
        return res.status(404).json({ message: "User không tồn tại" });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Cập nhật user thất bại", error });
    }
  };

  delete = async (req, res) => {
    try {
      const success = await UserService.deleteUser(req.params.id);
      if (!success)
        return res.status(404).json({ message: "User không tồn tại" });
      res.status(200).json({ message: "Xóa user thành công" });
    } catch (error) {
      res.status(500).json({ message: "Xóa user thất bại", error });
    }
  };
}

module.exports = new UserController();

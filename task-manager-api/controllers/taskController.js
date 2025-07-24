const Task = require('../models/Task');
const User = require('../models/User');

const getTasks = async (req, res) => {
  const { status, sort, search, page = 1, limit = 10 } = req.query;

  const query = {};

  if (req.user.role === 'user') {
    query.user = req.user._id;
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    populate: { path: 'user', select: 'username email role' },
  };

  if (sort) {
    const [field, order] = sort.split(':');
    options.sort = { [field]: order === 'desc' ? -1 : 1 };
  } else {
    options.sort = { createdAt: -1 };
  }

  try {
    const tasks = await Task.paginate(query, options);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'username email role');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user._id.toString() !== req.user._id.toString() && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createTask = async (req, res) => {
  const { title, description, status } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Please add a title and description' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      status,
      user: req.user._id,
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateTask = async (req, res) => {
  const { title, description, status } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
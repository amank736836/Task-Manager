const Task = require('../models/Task');
const User = require('../models/User');

const getDashboardAnalytics = async (req, res) => {
  try {
    let totalTasks = 0;
    let tasksByStatus = {};
    let allUsersStats = {};

    if (req.user.role === 'manager') {
      totalTasks = await Task.countDocuments();
      tasksByStatus = await Task.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const users = await User.find().select('_id username email role');
      for (const user of users) {
        const userTasks = await Task.find({ user: user._id });
        const userTotalTasks = userTasks.length;
        const userTasksByStatus = userTasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {});
        allUsersStats[user.username] = {
          totalTasks: userTotalTasks,
          tasksByStatus: userTasksByStatus,
        };
      }

    } else {
      totalTasks = await Task.countDocuments({ user: req.user._id });
      tasksByStatus = await Task.aggregate([
        {
          $match: { user: req.user._id },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);
    }

    const formattedTasksByStatus = tasksByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      totalTasks,
      tasksByStatus: formattedTasksByStatus,
      ...(req.user.role === 'manager' && { allUsersStats }),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDashboardAnalytics };
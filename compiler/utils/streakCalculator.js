// utils/streakCalculator.js
const Submission = require('../models/Submission');
const User = require('../models/User');

const calculateStreak = async (userId) => {
  console.log('Calculating streak for user:', userId);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  console.log('Today:', today);
  console.log('Yesterday:', yesterday);

  // Check if there's a submission for today
  const todaySubmission = await Submission.findOne({
    userId: userId,
    status: 'Accepted',
    createdAt: { $gte: today, $lt: now }
  });

  console.log('Today\'s submission:', todaySubmission);

  // Get the user's current streak
  const user = await User.findById(userId);
  let { currentStreak = 0, maxStreak = 0, lastSubmission } = user;

  if (todaySubmission) {
    // If there's a submission today, increment the streak
    if (!lastSubmission || lastSubmission < yesterday) {
      // Reset streak if last submission was before yesterday
      currentStreak = 1;
    } else {
      currentStreak += 1;
    }
    lastSubmission = now;
  } else {
    // If no submission today, check if streak should be reset
    if (!lastSubmission || lastSubmission < yesterday) {
      currentStreak = 0;
    }
  }

  // Update max streak if necessary
  maxStreak = Math.max(currentStreak, maxStreak);

 
            user.currentStreak=currentStreak;
            user.maxStreak=maxStreak;
            await user.save();

  return { currentStreak, maxStreak };
};

module.exports = calculateStreak;
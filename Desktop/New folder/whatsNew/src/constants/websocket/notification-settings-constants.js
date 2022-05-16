/*
Deduction logic is provided by backend, connect with backend 
team in case new state need to be added removed.
*/
const NotificationSettings = {
  NOTIFICATION_DISABLED: 0,
  NOTIFICATION_RESERVED: 128,
  NOTIFICATION_ALL: 255,
  NOTIFICATION_MENTIONS: 1,
  NOTIFICATION_REACTIONS: 2,
  NOTIFICATION_MENTIONS_AND_REACTIONS: 3,
  NOTIFICATION_POST: 4,
  NOTIFICATION_REPLY: 8,
  NOTIFICATION_TAG: 16,
  NOTIFICATION_TASK: 32,
};

export default NotificationSettings;

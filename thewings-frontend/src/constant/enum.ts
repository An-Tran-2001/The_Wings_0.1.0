export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}
export enum DataStatus {
  IDLE,
  LOADING,
  SUCCESS,
  FAILED,
}
export enum PostStatus {
  PUBLIC = "public",
  PRIVATE = "private",
  PRIVATE_ONLY= "private_only",
}
export enum LikeStatus {
  DISLIKE = "dislike",
  LIKE = "like",
  LOVE = "love",
  HAHA = "haha",
  WOW = "wow",
  SAD = "sad",
  ANGRY = "angry",
}

export enum Sex {
  MALE,
  FEAMLE,
}

export enum WebSocket {
  READ_MESSAGE = "read_message",
  TYPING = "typing",
  CHAT_MESSAGE = "chat_message",
  CHAT_MESSAGE_ECCHO = "chat_message_eccho",
  UN_READ_COUNT = "unread_count",
  NEW_MESSAGE_NOTIFICAL = "new_message_notifical",
}
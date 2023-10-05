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

export enum WebSocketType {
  READ_MESSAGE = "read_message",
  TYPING = "typing",
  CHAT_MESSAGE = "chat_message",
  CHAT_MESSAGE_ECHO = "chat_message_echo",
  UN_READ_COUNT = "unread_count",
  NEW_MESSAGE_NOTIFICAL = "new_message_notifical",
  TYPING_TRUE = "typing_true",
  TYPING_FALSE = "typing_false",
}
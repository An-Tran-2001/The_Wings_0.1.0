const Endpoint = {
  LOGIN: "users/login/",
  REGISTER: "users/register/",
  CONFIRM_CODE: "users/register-confirm/",
  FORGOT_PASSWORD: "users/forgot-password/",
  RESET_PASSWORD: "users/reset-password/",
  GETINFO: "api/users/me/",
  SEARCH_USER: "users/search/",
  CREATE_POST: "posts/my-posts/creat/",
  GET_MY_POSTS: "posts/my_post_all/",
  GET_HOME_POSTS: "posts/all/",
  GET_ORTHER_INFO: "users/get/",
  GET_OTHER_POSTS: "posts/",
  POST_LIKE: "posts/like/",
  POST_COMMENT: "posts/comment/",
  CHANGE_PROFILE: "users/create-profile/",
  GET_CONVERSATIONS: "api/conversations/",
  GET_MESSAGES: "api/messages/",
  ADD_FRIEND: "friends/friends_request/",
  REMOVE_FRIEND: "friends/delete_friend/",
  ACCEPT_REQUEST: "friends/user_request_friend/",
  GET_FRIENDS: "friends/friends/",
  GET_REQUESTS: "friends/user_request_friend/",
  CHANGE_POST: "posts/my-posts/",
};

export default Endpoint;

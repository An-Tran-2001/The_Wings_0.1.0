export interface FriendItem {
    id: number,
    name: string,
    avatar: string,
    isFriend?: boolean
}

export const FRIENDS = Array(12).fill(0).map((_, index) => ({
    id: index,
    name: "Trần Văn An " + index,
    avatar: `https://picsum.photos/${800 + index}/${800 + index}`,
    isFriend: true,
}))

export const FRIENDS_REQUEST = Array(12)
  .fill(0)
  .map((_, index) => ({
    id: index,
    name: "An Trần " + index,
    avatar: `https://picsum.photos/${820 + index}/${820 + index}`,
    isFriend: false,
  }));
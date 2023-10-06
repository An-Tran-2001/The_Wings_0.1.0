import { useAppDispatch, useAppSelector } from "store/hooks";
import { useCallback } from "react";
import { CreateCommentPayload, LikeSet, createPost, getOrtherPosts, getPosts, getPostsHome, postComment, postLike } from "./actions";
import { PostStatus } from "constant/enum";
import { Post,  viewPost} from "./reducer";

export interface CreatePostPayload {
    content: string;
    files: File[];
    status: PostStatus;
    tags: number[];
}
export const usePost = () => {
    const dispatch = useAppDispatch();
    const { posts, post, postState } = useAppSelector((state) => state.post);
    const onCreatePost = useCallback(
        async (payload: CreatePostPayload) => {
        try {
            await dispatch(createPost(payload)).unwrap();
        } catch (error) {
            throw error;
        }
        },
        [dispatch],
    );
    const onGetPosts = useCallback(
        async () => {
        try {
            await dispatch(getPosts()).unwrap();
        } catch (error) {
            throw error;
        }
        },
        [dispatch],
    );
    const onGetPostsHome = useCallback(
        async () => {
        try {
            await dispatch(getPostsHome()).unwrap();
        } catch (error) {
            throw error;
        }
        },
        [dispatch],
    );
    const onGetOrtherPosts = useCallback(
      async (username: string) => {
        try {
          await dispatch(getOrtherPosts(username)).unwrap();
        } catch (error) {
          throw error;
        }
      },
      [dispatch],
    );
    const onLikePost = useCallback(
        async (payload: LikeSet) => {
        try {
            await dispatch(postLike(payload)).unwrap();
        } catch (error) {
            throw error;
        }
        },
        [dispatch],
    );
    const onViewPost = useCallback(
        async (post: Post) => {
        await dispatch(viewPost(post));
    },
        [dispatch],
    );
    const onCommentPost = useCallback(
      async (payload: CreateCommentPayload) => {
        try {
          await dispatch(postComment(payload)).unwrap();
        } catch (error) {
          throw error;
        }
      },
      [dispatch],
    );
    return {
        posts,
        post,
        postState,
        onCreatePost,
        onGetPosts,
        onGetPostsHome,
        onGetOrtherPosts,
        onLikePost,
        onViewPost,
        onCommentPost,
    };
    };
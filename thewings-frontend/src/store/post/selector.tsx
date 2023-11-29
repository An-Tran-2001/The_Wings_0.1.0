import { useAppDispatch, useAppSelector } from "store/hooks";
import { useCallback } from "react";
import { CreateCommentPayload, LikeSet, createPost, deletePost, getOrtherPosts, getPosts, getPostsHome, postComment, postLike, deleteComment, UpdatePost, changePost } from "./actions";
import { PostStatus } from "constant/enum";
import { Post,  popPost,  viewPost} from "./reducer";
import { PagePaginationRequest } from "store/interfaces";

export interface CreatePostPayload {
    content: string;
    files: File[];
    status: PostStatus;
    tags: number[];
}

export interface OtherPostRequest extends PagePaginationRequest {
    username: string;
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
        async (params: PagePaginationRequest) => {
        try {
            await dispatch(getPosts(params)).unwrap();
        } catch (error) {
            throw error;
        }
        },
        [dispatch],
    );
    const onGetPostsHome = useCallback(
      async (params: PagePaginationRequest) => {
        try {
          await dispatch(getPostsHome(params)).unwrap();
        } catch (error) {
          throw error;
        }
      },
      [dispatch],
    );
    const onGetOrtherPosts = useCallback(
      async (params: OtherPostRequest) => {
        try {
          await dispatch(getOrtherPosts(params)).unwrap();
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
    const onDeletePost = useCallback(
        async (id: number) => {
            try {
            await dispatch(deletePost(id)).unwrap();
            } catch (error) {
            throw error;
            }
        },
        [dispatch],
        );
    const onDeleteComment = useCallback(
        async (id: number) => {
            try {
            await dispatch(deleteComment(id)).unwrap();
            } catch (error) {
            throw error;
            }
        },
        [dispatch],
        );
    const onPopPost = async (id: number) => await dispatch(popPost({id: id}));
    const onUpdatePost = useCallback(
        async (payload: UpdatePost) => {
            try {
            await dispatch(changePost(payload)).unwrap();
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
        onDeletePost,
        onDeleteComment,
        onPopPost,
        onUpdatePost,
    };
    };

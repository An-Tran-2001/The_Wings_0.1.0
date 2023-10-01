import { useAppDispatch, useAppSelector } from "store/hooks";
import { useCallback } from "react";
import { createPost } from "./actions";
import { PostStatus } from "constant/enum";

export interface CreatePostPayload {
    content: string;
    files: File[];
    status: PostStatus;
    tags: number[];
}

export const usePost = () => {
    const dispatch = useAppDispatch();
    const { post, postState } = useAppSelector((state) => state.post);
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
    return {
        post,
        postState,
        onCreatePost,
    };
    };

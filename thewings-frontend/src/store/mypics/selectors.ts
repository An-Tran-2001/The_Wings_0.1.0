import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";

import { Pic, addPic, removePic } from "./reducer";
import { getMyPics, getYoursPics, getYoursPicsParams } from "./actions";
import { PagePaginationRequest } from "store/interfaces";

export const useMyPics = () => {
    const dispatch = useAppDispatch();
    const { pics, status, error } = useAppSelector((state) => state.myPics);

    const fetchMyPics = useCallback((params: PagePaginationRequest) => {
        dispatch(getMyPics(params));
    }, [dispatch]);

    const fetchYoursPics = useCallback((params: getYoursPicsParams) => {
        dispatch(getYoursPics(params));
    }, [dispatch]);
    
    const addMyPic = useCallback((pic: Pic) => {
        dispatch(addPic(pic));
    }, [dispatch]);

    const removeMyPic = useCallback((id: number) => {
        dispatch(removePic(id));
    }, [dispatch]);

    return {
        pics,
        status,
        error,
        fetchMyPics,
        fetchYoursPics,
        addMyPic,
        removeMyPic,
    };
};
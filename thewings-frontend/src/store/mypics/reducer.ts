import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enum";
import {
  getMyPics,
} from "./actions";
import { PagePaginationResponse } from "store/interfaces";

export interface Pic {
    id: number;
    file: string;
    name: string;
    created_at: string;
    updated_at: string;
    post: number;
}

export interface PicsResonse extends PagePaginationResponse {
    results: Pic[];
}

export interface MyPicsState {
    pics: Pic[];
    status: DataStatus;
    error: string | null;
}

const initialState: MyPicsState = {
    pics: [],
    status: DataStatus.IDLE,
    error: null,
};

const myPicsSlice = createSlice({
    name: "my_pics",
    initialState,
    reducers: {
        addPic(state, action: PayloadAction<Pic>) {
            state.pics.unshift(action.payload);
        },
        removePic(state, action: PayloadAction<number>) {
            state.pics = state.pics.filter((pic) => pic.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMyPics.pending, (state) => {
            state.status = DataStatus.LOADING;
        });
        builder.addCase(getMyPics.fulfilled, (state, action) => {
            state.status = DataStatus.SUCCESS;
            state.pics = action.payload.results;
        });
        builder.addCase(getMyPics.rejected, (state, action) => {
            state.status = DataStatus.FAILED;
            state.error = action.payload as string;
        });
    }
});

export const { addPic, removePic } = myPicsSlice.actions;
export default myPicsSlice.reducer;
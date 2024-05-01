import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {entity} from "../entity.ts";

export interface commentState {
    comments: entity[]
    kidsAdded: number[]
}


const initialState: commentState = {
    comments: [],
    kidsAdded: []
}
export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        setComments: (state, action: PayloadAction<entity[]>) => {
            state.comments = action.payload
            state.kidsAdded = action.payload.map(function (comment) {
                return comment.id;
            })
        }
    },
})
const {reducer} = commentSlice
export {reducer as commentsReducer}
export const {setComments} = commentSlice.actions


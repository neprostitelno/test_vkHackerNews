import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {entity} from "../entity.ts";

export interface newsState {
    news: entity[]
}

const initialState: newsState = {
    news: []
}

export const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        setNewsPage: (state, action: PayloadAction<entity[]>) => {
            state.news = action.payload

        }
    },
})
const {reducer} = newsSlice
export {reducer as newsReducer}
export const {setNewsPage} = newsSlice.actions


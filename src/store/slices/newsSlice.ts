import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface news {
    by: string,
    descendants: number,
    id: number,
    kids: number[],
    score: number,
    time: number,
    title: string,
    type: string,
    url: string,
}

export interface newsState {
    news: news[]
}


const initialState: newsState = {
    news: []
}
export const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        setNewsPage: (state, action: PayloadAction<news[]>) => {
            state.news = action.payload

        }
    },
})
const {reducer} = newsSlice
export {reducer as newsReducer}
export const {setNewsPage} = newsSlice.actions


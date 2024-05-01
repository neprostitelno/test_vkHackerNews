import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {entity} from "../entity.ts"


const initialState: entity = {
    by: "",
    deleted: false,
    descendants: 0,
    id: 0,
    kids: [],
    parent: "",
    score: 0,
    text: "",
    time: 0,
    title: "",
    type: "",
    url: ""
}

export const newsPageSlice = createSlice({
    name: 'newPage',
    initialState,
    reducers: {
        setNewsPage: (state, action: PayloadAction<entity>) => {
            state.id = action.payload.id
            state.by = action.payload.by
            state.descendants = action.payload.descendants
            state.kids = action.payload.kids
            state.score = action.payload.score
            state.time = action.payload.time
            state.title = action.payload.title
            state.type = action.payload.type
            state.url = action.payload.url
        }
    },
})
const {reducer} = newsPageSlice
export {reducer as newsPageReducer}
export const {setNewsPage} = newsPageSlice.actions


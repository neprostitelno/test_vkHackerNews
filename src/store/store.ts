import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {newsReducer} from './slices/newsSlice.ts'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {newsPageReducer} from "./slices/newsPageSlice.ts";
import {commentsReducer} from "./slices/commentsSlice.ts";

const rootReducer = combineReducers({
    news: newsReducer,
    newsPage: newsPageReducer,
    comments: commentsReducer
})
const store = configureStore({
    reducer: rootReducer,
    devTools: true,
})

export default store;

export type RootDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof rootReducer>

type DispatchFunc = () => RootDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
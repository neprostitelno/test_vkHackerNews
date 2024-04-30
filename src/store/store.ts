import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {newsReducer} from './slices/newsSlice.ts'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {RootState} from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
    news: newsReducer
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
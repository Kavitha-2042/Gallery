import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import { RootState, AppDispatch } from "./Store";

export const useAppState:TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
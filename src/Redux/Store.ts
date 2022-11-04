import {configureStore} from '@reduxjs/toolkit'
import userSlice from './Slice/userSlice'

const Store = configureStore({
    reducer:{
        user:userSlice
    }
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch
export default Store
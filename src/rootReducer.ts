import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import userReducer from './features/auth/useSlice';
import diariesReducer from './features/diary/diariesSlice';
import entriesReducer from './features/entry/entriesSclice';
import editorReducer from './features/entry/editorSlice';
import { TypeOfTag } from 'typescript';

const rootReducer = combineReducers({
    auth: authReducer,
    diaries: diariesReducer,
    entries: entriesReducer,
    user: userReducer,
    editor: editorReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
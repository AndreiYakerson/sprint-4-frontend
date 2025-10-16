
import { IS_FLOATING_OPEN, IS_POPUP_ON, SET_IS_APP_LOADING, SET_SIDE_BAR_OPEN, SET_TXT_HIGH_LIGHT } from '../reducers/system.reducer.js'
import { store } from '../store'


export async function onSetIsSideBarOpen(value) {
    try {
        store.dispatch({ type: SET_SIDE_BAR_OPEN, value })
    } catch (err) {
        console.log('Cannot Close Side Bar', err)
        throw err
    }
}

export async function onSetPopUpIsOpen(value) {
    try {
        store.dispatch({ type: IS_POPUP_ON, value })
    } catch (err) {
        console.log('Cannot Close PopUp Bar', err)
        throw err
    }
}

export async function onSetFloatingIsOpen(value) {
    try {
        store.dispatch({ type: IS_FLOATING_OPEN, value })
    } catch (err) {
        console.log('Cannot Close floating cmp', err)
        throw err
    }
}


export function onSetIsApploading(isLoading) {
    store.dispatch({ type: SET_IS_APP_LOADING, isLoading })
}


export async function onSetHighLightedTxt(txt) {
    try {
        store.dispatch({ type: SET_TXT_HIGH_LIGHT, txt })
    } catch (err) {
        console.log('Cannot Set Txt To High-Light', err)
        throw err
    }

}

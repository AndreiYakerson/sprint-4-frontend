
import { IS_FLOATING_OPEN, IS_POPUP_ON, SET_SIDE_BAR_OPEN } from '../reducers/system.reducer.js'
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

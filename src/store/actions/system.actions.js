
import { IS_POPUP_ON, SET_SIDE_BAR_OPEN } from '../reducers/system.reducer.js'
import { store } from '../store'


export async function onSetIsSideBarOpen(value) {
    try {
        store.dispatch({ type: SET_SIDE_BAR_OPEN, value })
        return console.log(`Side Bar is-open set to ${value}`)
    } catch (err) {
        console.log('Cannot Close Side Bar', err)
        throw err
    }
}

export async function onSetPopUpIsOpen(value) {
    try {
        store.dispatch({ type: IS_POPUP_ON, value })
        return console.log(` PopUp is-open set to ${value}`)
    } catch (err) {
        console.log('Cannot Close PopUp Bar', err)
        throw err
    }
}

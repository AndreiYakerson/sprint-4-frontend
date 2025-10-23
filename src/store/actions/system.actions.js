
import { CLOSE_FLOATING, CLOSE_FLOATING_SECONDARY, CLOSE_POPUP, IS_FLOATING_OPEN, SET_FLOATING, SET_FLOATING_SECONDARY, SET_IS_APP_LOADING, SET_POPUP, SET_SIDE_BAR_OPEN, SET_TXT_HIGH_LIGHT } from '../reducers/system.reducer.js'
import { store } from '../store'


export async function onSetIsSideBarOpen(value) {
    try {
        store.dispatch({ type: SET_SIDE_BAR_OPEN, value })
    } catch (err) {
        console.log('Cannot Close Side Bar', err)
        throw err
    }
}

// export async function onSetPopUpIsOpen(value) {
//     try {
//         store.dispatch({ type: IS_POPUP_ON, value })
//     } catch (err) {
//         console.log('Cannot Close PopUp Bar', err)
//         throw err
//     }
// }

export async function onSetPopUp(content) {
    onCloseFloating()
    try {
        store.dispatch({ type: SET_POPUP, content })
    } catch (err) {
        console.log('Cannot set PopUp', err)
        throw err
    }
}

export async function onClosePopUp() {
    try {
        store.dispatch({ type: CLOSE_POPUP })
    } catch (err) {
        console.log('Cannot Close PopUp ', err)
        throw err
    }

}
export async function onSetFloating(content, anchor) {
    const floatingOpen = store.getState().systemModule.floating.isOpen
    const floatingSecondaryOpen = store.getState().systemModule.floatingSecondary.isOpen
    if (floatingOpen) await onCloseFloating()

    try {
        store.dispatch({ type: SET_FLOATING, content, anchor })
    } catch (err) {
        console.log('Cannot set floating', err)
        throw err
    }
}

export async function onSetFloatingSecondary(content, anchor) {
    const floatingSecondary = store.getState().systemModule.floatingSecondary.isOpen
    if (floatingSecondary) return
    try {
        store.dispatch({ type: SET_FLOATING_SECONDARY, content, anchor })
    } catch (err) {
        console.log('Cannot set floatingSecondary', err)
        throw err
    }
}

export async function onCloseFloating() {

    try {
        store.dispatch({ type: CLOSE_FLOATING })
    } catch (err) {
        console.log('Cannot Close floating ', err)
        throw err
    }

}
export async function onCloseFloatingSecondary() {
    try {
        store.dispatch({ type: CLOSE_FLOATING_SECONDARY })
    } catch (err) {
        console.log('Cannot Close floatingSecondary ', err)
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


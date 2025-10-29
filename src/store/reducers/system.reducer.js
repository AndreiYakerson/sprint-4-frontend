export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'

export const SET_TXT_HIGH_LIGHT = 'SET_TXT_HIGH_LIGHT'

export const SET_POPUP = 'SET_POPUP'
export const CLOSE_POPUP = 'CLOSE_POPUP'
// export const IS_POPUP_ON = 'IS_POPUP_ON'
export const SET_FLOATING = 'SET_FLOATING'
export const SET_FLOATING_SECONDARY = 'SET_FLOATING_SECONDARY'
export const CLOSE_FLOATING = 'CLOSE_FLOATING'
export const CLOSE_FLOATING_SECONDARY = 'CLOSE_FLOATING_SECONDARY'
export const IS_FLOATING_OPEN = 'IS_FLOATING_OPEN'
export const SET_SIDE_BAR_OPEN = 'SET_SIDE_BAR_OPEN'

export const SET_IS_APP_LOADING = 'SET_IS_APP_LOADING'


const initialState = {
  isLoading: false,
  isSideBarOpen: false,
  isPopUpOpen: false,
  popUp: { isOpen: false, content: null },
  floating: { isOpen: false, content: null, anchor: null },
  floatingSecondary: { isOpen: false, content: null, anchor: null },
  isAppLoading: false,
  txtToHighLight: '',
}

export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true }
    case LOADING_DONE:
      return { ...state, isLoading: false }
    case SET_POPUP:
      return { ...state, popUp: { isOpen: true, content: action.content } }
    case CLOSE_POPUP:
      return { ...state, popUp: { isOpen: false, content: action.content } }
    case SET_FLOATING:
      return { ...state, floating: { isOpen: true, anchor: action.anchor, content: action.content } }
    case SET_FLOATING_SECONDARY:
      return { ...state, floatingSecondary: { isOpen: true, anchor: action.anchor, content: action.content } }
    case CLOSE_FLOATING:
      return { ...state, floating: { isOpen: false, anchor: false, content: action.content } ,floatingSecondary: { isOpen: false, anchor: false, content: action.content } }
    case CLOSE_FLOATING_SECONDARY:
      return { ...state, floatingSecondary: { isOpen: false, anchor: false, content: action.content } }
    // case IS_POPUP_ON:
    //   if (state.isFloatingOpen) state.isFloatingOpen = false
    //   return { ...state, isPopUpOpen: action.value }
    case IS_FLOATING_OPEN:
      return { ...state, isFloatingOpen: action.value }
    case SET_SIDE_BAR_OPEN:
      return { ...state, isSideBarOpen: action.value }
    case SET_IS_APP_LOADING:
      return { ...state, isAppLoading: action.isLoading }
    case SET_TXT_HIGH_LIGHT:
      return { ...state, txtToHighLight: action.txt }
    default: return state
  }
}
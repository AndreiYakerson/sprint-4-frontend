export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'

export const SET_TXT_HIGH_LIGHT = 'SET_TXT_HIGH_LIGHT'

export const IS_POPUP_ON = 'IS_POPUP_ON'
export const IS_FLOATING_OPEN = 'IS_FLOATING_OPEN'
export const SET_SIDE_BAR_OPEN = 'SET_SIDE_BAR_OPEN'

export const SET_IS_APP_LOADING = 'SET_IS_APP_LOADING'


const initialState = {
  isLoading: false,
  isSideBarOpen: true,
  isPopUpOpen: false,
  isFloatingOpen: false,
  isAppLoading: false,
  txtToHighLight:'',
}

export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true }
    case LOADING_DONE:
      return { ...state, isLoading: false }
    case IS_POPUP_ON:
      if (state.isFloatingOpen) state.isFloatingOpen = false
      return { ...state, isPopUpOpen: action.value }
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
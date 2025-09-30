export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'

export const IS_POPUP_ON = 'IS_POPUP_ON'
export const SET_SIDE_BAR_OPEN = 'SET_SIDE_BAR_OPEN'

const initialState = {
  isLoading: false,
  isSideBarOpen: true,
  isPopUpOpen: false,
}

export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true }
    case LOADING_DONE:
      return { ...state, isLoading: false }
    case IS_POPUP_ON:
      return { ...state, isPopUpOpen: action.value }
    case SET_SIDE_BAR_OPEN:
      return { ...state, isSideBarOpen: action.value }
    default: return state
  }
}

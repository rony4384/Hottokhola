export const initialState = {
  searchTerm: "",
  logo: "",
  grocery_banner: "",
  lifestyle_banner: "",
  inside_dhaka_shipping_charge: "",
  outside_dhaka_shipping_charge: "",
  reward_percentage: "",
  grocery_title: "",
  grocery_subtitle: "",
  lifestyle_title: "",
  lifestyle_subtitle: "",
  hotline: "",
  isSticky: false,
  isSidebarSticky: true,
  isDrawerOpen: false,
};

type ActionType =
  | { type: "SET_SETTING"; payload: any | null }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_STICKY" }
  | { type: "REMOVE_STICKY" }
  | { type: "SET_SIDEBAR_STICKY" }
  | { type: "REMOVE_SIDEBAR_STICKY" }
  | { type: "TOGGLE_DRAWER" };

type StateType = typeof initialState;

export function appReducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "SET_SETTING":
      return {
        ...state,
        logo: action.payload.logo,
        grocery_banner: action.payload.grocery_banner,
        lifestyle_banner: action.payload.lifestyle_banner,
        inside_dhaka_shipping_charge:
          action.payload.inside_dhaka_shipping_charge,
        outside_dhaka_shipping_charge:
          action.payload.outside_dhaka_shipping_charge,
        reward_percentage: action.payload.reward_percentage,
        grocery_title: action.payload.grocery_title,
        grocery_subtitle: action.payload.grocery_subtitle,
        lifestyle_title: action.payload.lifestyle_title,
        lifestyle_subtitle: action.payload.lifestyle_subtitle,
        hotline: action.payload.hotline,
      };
    case "SET_SEARCH_TERM":
      return {
        ...state,
        searchTerm: action.payload,
      };
    case "SET_STICKY":
      return {
        ...state,
        isSticky: true,
      };
    case "REMOVE_STICKY":
      return {
        ...state,
        isSticky: false,
      };
    case "SET_SIDEBAR_STICKY":
      return {
        ...state,
        isSidebarSticky: true,
      };
    case "REMOVE_SIDEBAR_STICKY":
      return {
        ...state,
        isSidebarSticky: false,
      };
    case "TOGGLE_DRAWER":
      return {
        ...state,
        isDrawerOpen: !state.isDrawerOpen,
      };
    default: {
      throw new Error(`Unsupported action type at App Reducer`);
    }
  }
}

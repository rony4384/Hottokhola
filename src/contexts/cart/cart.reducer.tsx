// export const cartItemsTotalPrice = (items, { discount_amount = 0 } = {}) => {
export const cartItemsTotalPrice = (items, coupon = null, shipping = 0) => {
  if (items === null || items.length === 0) return 0;
  const itemCost = items.reduce((total, item) => {
    if (item.sale_price) {
      return total + item.sale_price * item.quantity;
    }
    return total + item.price * item.quantity;
  }, 0);
  // const discountRate = 1 - discount_amount;
  var discount = 0;
  if (coupon) {
    if (coupon.discount_type === "Fixed") {
      discount = coupon.discount_amount;
    } else {
      discount = (itemCost * Number(coupon.discount_amount)) / 100;
      discount =
        coupon.maximum_discount > 0
          ? Math.min(coupon.maximum_discount, discount)
          : discount;
    }
  }
  // itemCost * discountRate * TAX_RATE + shipping;
  // return itemCost * discountRate;
  return itemCost - discount + shipping;
};
// cartItems, cartItemToAdd
const addItemToCart = (state, action) => {
  const existingCartItemIndex = state.items.findIndex(
    (item) => item.id === action.payload.id
  );
  console.log(action.payload, "payload");
  if (existingCartItemIndex > -1) {
    const newState = [...state.items];
    console.log(
      newState[existingCartItemIndex].quantity,
      action.payload.quantity,
      action.payload.purchase_limit
    );
    if (
      action.payload.purchase_limit > 0 &&
      newState[existingCartItemIndex].quantity + action.payload.quantity >
        action.payload.purchase_limit
    )
      return newState;
    newState[existingCartItemIndex].quantity += action.payload.quantity;
    return newState;
  }
  return [...state.items, action.payload];
};

// cartItems, cartItemToRemove
const removeItemFromCart = (state, action) => {
  return state.items.reduce((acc, item) => {
    if (item.id === action.payload.id) {
      const newQuantity = item.quantity - action.payload.quantity;

      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc];
    }
    return [...acc, item];
  }, []);
};

const clearItemFromCart = (state, action) => {
  return state.items.filter((item) => item.id !== action.payload.id);
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "REHYDRATE":
      return { ...state, ...action.payload };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "ADD_ITEM":
      return { ...state, items: addItemToCart(state, action) };
    case "REMOVE_ITEM":
      return { ...state, items: removeItemFromCart(state, action) };
    case "CLEAR_ITEM_FROM_CART":
      return { ...state, items: clearItemFromCart(state, action) };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "APPLY_COUPON":
      return { ...state, coupon: action.payload };
    case "APPLY_SHIPPING":
      return { ...state, shipping: action.payload };
    case "REMOVE_COUPON":
      return { ...state, coupon: null };
    case "TOGGLE_RESTAURANT":
      return { ...state, isRestaurant: !state.isRestaurant };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

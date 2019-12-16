import { RECEIVE_DATA } from '../identifiers';

export const defaultState = {};

const cache = (state = defaultState, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return {
        ...state,
        [action.payload.cacheKey]: action.payload.value,
      };
    default:
      return {
        ...state,
      };
  }
};

export default cache;

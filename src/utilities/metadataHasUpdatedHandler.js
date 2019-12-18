import { isEmptyObj } from './isEmptyObj';
export const metadataHasUpdatedHandler = (updateFn) => {
  return (newState, addedTags, removedTags) => {
    if (!isEmptyObj(addedTags) || !isEmptyObj(removedTags)) {
      updateFn(true);
    }
  }
}
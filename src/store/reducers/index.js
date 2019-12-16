// Local dir imports first in alpha order
import cache from './cache';
import form from './form';
import globals from './globals';

// Others in alpha order
import * as trackingActions from '../modules/analytics/tracking/tracking.actions';
import tracking from '../modules/analytics/tracking/tracking.reducer';

export const actions = {
  ...trackingActions
};

export default {
    cache,
    form,
    globals,
    tracking
};
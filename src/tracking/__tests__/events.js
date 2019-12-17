import { trackedEvents } from '../index';

// Cheat methods copied from events...
const getBase = (action, source, data) => ({
  action: action,
  data: data,
  source: source
});
const getBaseClick = (source, data) => getBase('click', source, data);

const TEST_CASES = [
  [ "trackClearFormLinkClick",
    "works",
    ['advanced'],
    getBaseClick(
      'clear_form_link',
      {
        formType: 'advanced'
      }
    )
  ],
]


describe("Event Tracking Object Generators", ()=> {
  test.each(TEST_CASES)(
    "%# - %s - %s", 
    (fnName, scenario, params, expected) => {
    const actual = trackedEvents[fnName](...params);
    expect(actual).toEqual(expected);
  })
});
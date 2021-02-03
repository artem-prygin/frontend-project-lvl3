import { formErr } from '../constants.js';

export default {
  mixed: {
    required: formErr.FIELD_IS_REQUIRED,
  },
  string: {
    url: formErr.URL,
    notOneOf: formErr.URL_IS_ALREADY_IN_THE_LIST,
  },
};

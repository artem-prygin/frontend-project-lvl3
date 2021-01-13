import * as yup from 'yup';
import _ from 'lodash';
import { i18nObj as i18n } from './translationHandlers.js';

yup.setLocale({
  mixed: {
    required: i18n.t('feedbackMsg.required'),
  },
  string: {
    url: i18n.t('feedbackMsg.url'),
  },
});

const schema = yup.object().shape({
  url: yup.string().url().required(),
});

export default (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

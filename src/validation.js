import * as yup from 'yup';
import _ from 'lodash';

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

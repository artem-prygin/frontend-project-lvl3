import * as yup from 'yup';
import _ from 'lodash';

export default (fields, watcher) => {
  const urls = watcher.channels.map(({ url }) => url);
  const schema = yup.object().shape({
    url: yup.string().url().required().notOneOf(urls),
  });

  try {
    schema.validateSync(fields, { abortEarly: false });
    return null;
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

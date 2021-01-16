import * as yup from 'yup';

export default (link, watcher) => {
  const currentUrls = watcher.channels.map(({ url }) => url);
  const schema = yup.string().required().url().notOneOf(currentUrls);
  try {
    schema.validateSync(link);
    return null;
  } catch (e) {
    return e.type;
  }
};

import { TagsMap } from './api.types.ts';
import { Tag } from '../components/CurrentPageContextProvider/context.ts';

export const convertTagsType = (tagsObject: TagsMap): Tag[] => {
  return Object.entries(tagsObject).map(([name, value]) => ({ name, value }));
};

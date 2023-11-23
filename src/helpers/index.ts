import { format, parseISO } from 'date-fns';

export function shortenText(str: string, limit = 70) {
  let len = 0;
  let shortText;
  const shortWorlds = [];
  const worlds = str.split(' ');
  for (let i = 0; i < worlds.length; i++) {
    if (len + worlds[i].length >= limit) break;
    shortWorlds.push(worlds[i]);
    len += worlds[i].length;
  }
  shortText = shortWorlds.join(' ');
  if (shortWorlds.length < worlds.length) shortText += '...';
  return shortText;
}
export function formatData(str: string) {
  let result;
  try {
    const date = parseISO(str);
    result = format(date, 'd MMM, yyyy');
  } catch (e) {
    result = '';
  }
  return result;
}

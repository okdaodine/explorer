import { format } from 'date-fns';

export default (date) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
}
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export default function convertDateToString(dateString: string) {
  const dateTime = dayjs(dateString).millisecond(0); //? 소수점 제거를 위해서 ms를 0으로 줌
  const now = dayjs();

  const diff = now.diff(dateTime);
  const calDuration = dayjs.duration(diff);
  const years = calDuration.years();
  const months = calDuration.months();
  const days = calDuration.days();
  const hours = calDuration.hours();
  const minutes = calDuration.minutes();
  const seconds = calDuration.seconds();

  if (
    years === 0 &&
    months === 0 &&
    days === 0 &&
    hours === 0 &&
    minutes === 0 &&
    seconds !== undefined &&
    (seconds === 0 || seconds < 1)
  ) {
    return '0초';
  }

  if (
    years === 0 &&
    months === 0 &&
    days === 0 &&
    hours === 0 &&
    minutes == 0 &&
    seconds
  ) {
    return `${Math.floor(seconds)}초`;
  }

  if (years === 0 && months === 0 && days === 0 && hours === 0) {
    return `${minutes}분`;
  }

  if (years === 0 && months === 0 && days === 0) {
    return `${hours}시`;
  }

  if (years === 0 && months === 0) {
    return `${days}일`;
  }

  if (years === 0) {
    return `${months}개월`;
  }

  return `${years}년`;
}

export const convertTimeTo24Hour = (hour: string, minute: string) => {
  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);
  return hourNumber * 60 + minuteNumber;
};

export const convert24HourToTime = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;

  return {
    hour: hours.toString().padStart(2, '0'),
    minute: minutes.toString().padStart(2, '0'),
  };
};

export const addOneHour = (time: number) => {
  const newTime = time + 60;

  return newTime > 1440 ? 1435 : newTime;
};

import Button from '@/components/button/Button';
import CustomDayPicker from '@/components/customDayPicker/CustomDayPicker';
import Heading from '@/components/heading/Heading';
import XIcon from '@/components/icons/XIcon';
import Textarea from '@/components/textarea/Textarea';
import { Contents } from '@/models/contents';
import clsx from 'clsx';
import { addDays, format, subDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SessionProps {
  contents: Contents;
  setContents: React.Dispatch<React.SetStateAction<Contents>>;
  index: number;
  isMultiple?: boolean;
}

const SessionComponent = ({ contents, setContents, index, isMultiple = false }: SessionProps) => {
  const [openDayPicker, setOpenDayPicker] = useState(false);
  const dayPickerRef = useRef<HTMLDivElement>(null);
  const dayPickerBoxRef = useRef<HTMLDivElement>(null);

  const session = useMemo(() => contents.sessions[index], [contents, index]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDayPicker &&
        dayPickerRef.current &&
        !dayPickerRef.current.contains(event.target as Node) &&
        !dayPickerBoxRef.current?.contains(event.target as Node)
      ) {
        setOpenDayPicker(false);
      }
    };

    if (openDayPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDayPicker]);

  const handleRemoveSession = useCallback(() => {
    setContents((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== index),
    }));
  }, [setContents, index]);

  const handleSelectDate = useCallback(
    (date: Date | null) => {
      setContents((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session, i) => (i === index ? { ...session, date } : session)),
      }));
    },
    [contents, index, setContents],
  );

  return (
    <div className="relative py-6 md:py-7 px-4 md:px-5 flex flex-col gap-8 bg-[#F7F7F8] rounded-lg">
      {isMultiple && (
        <div
          className="absolute top-0 right-0 flex items-center justify-center w-12 h-12"
          onClick={handleRemoveSession}
        >
          <XIcon className="w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-[#F7F7F8] cursor-pointer" />
        </div>
      )}
      <div className="flex flex-col gap-4">
        <Heading variant="h2">{isMultiple ? `${index + 1}회차 정보` : '회차 정보'}</Heading>
        <div className="flex flex-col gap-3">
          <div className="relative h-13 md:h-15 grid grid-cols-[auto_1fr] items-center gap-6">
            <span className="text-16 md:text-18 font-semibold leading-[1.3]">날짜 선택</span>
            <div
              ref={dayPickerBoxRef}
              className={clsx(
                'box-style px-4 h-full text-16 md:text-20 font-medium leading-[1.3] flex items-center justify-center cursor-pointer',
                session.date ? 'text-default-text' : 'text-[#8F8F8F]',
              )}
              onClick={(event) => {
                setOpenDayPicker(!openDayPicker);
              }}
            >
              {session.date ? format(session.date, 'yyyy년 MM월 dd일') : '날짜를 선택해주세요'}
            </div>
            {openDayPicker && (
              <CustomDayPicker
                onClose={() => setOpenDayPicker(false)}
                dayPickerRef={dayPickerRef}
                onSelectDate={handleSelectDate}
                minDate={(() => {
                  // index - 1부터 0번째까지 역순으로 검색
                  for (let i = index - 1; i >= 0; i--) {
                    const sessionDate = contents.sessions[i]?.date;
                    if (sessionDate) {
                      return addDays(sessionDate, 1);
                    }
                  }
                  return undefined;
                })()}
                maxDate={(() => {
                  // index + 1부터 마지막까지 순차적으로 검색
                  for (let i = index + 1; i < contents.sessions.length; i++) {
                    const sessionDate = contents.sessions[i]?.date;
                    if (sessionDate) {
                      return subDays(sessionDate, 1);
                    }
                  }
                  return undefined;
                })()}
              />
            )}
          </div>
          <div className="h-13 md:h-15 grid grid-cols-[auto_1fr] items-center gap-6">
            <span className="text-16 md:text-18 font-semibold leading-[1.3]">시작 시간</span>
            <div className="box-style h-full grid grid-cols-[64px_1fr_auto_1fr] md:grid-cols-[80px_1fr_auto_1fr] items-center">
              <div className="flex items-center justify-center">
                <Button
                  variant={'line'}
                  size={'small'}
                  className="w-[52px]"
                  onClick={() => {
                    setContents((prev) => ({
                      ...prev,
                      sessions: prev.sessions.map((session, i) =>
                        i === index
                          ? {
                              ...session,
                              startMeridiem: session.startMeridiem === 'am' ? 'pm' : 'am',
                            }
                          : session,
                      ),
                    }));
                  }}
                >
                  {session.startMeridiem === 'am' ? '오전' : '오후'}
                </Button>
              </div>
              <input
                className="w-full text-18 md:text-20 font-medium leading-[1.3] outline-none text-center"
                inputMode="numeric"
                maxLength={2}
                value={session.startTimeHour}
                onChange={(e) => {
                  const numeric = e.target.value.replace(/\D/g, '').slice(0, 2);

                  if (numeric === '') {
                    setContents((prev) => ({
                      ...prev,
                      sessions: prev.sessions.map((session, i) =>
                        i === index ? { ...session, startTimeHour: '' } : session,
                      ),
                    }));
                    return;
                  }

                  let hour = parseInt(numeric, 10);

                  if (hour < 1) hour = 0;
                  if (hour > 12) hour = 12;

                  setContents((prev) => ({
                    ...prev,
                    sessions: prev.sessions.map((session, i) =>
                      i === index ? { ...session, startTimeHour: String(hour) } : session,
                    ),
                  }));
                }}
                onBlur={() => {
                  setContents((prev) => ({
                    ...prev,
                    sessions: prev.sessions.map((session, i) =>
                      i === index
                        ? {
                            ...session,
                            startTimeHour: String(session.startTimeHour).padStart(2, '0'),
                          }
                        : session,
                    ),
                  }));
                }}
              />
              <span className="text-18 font-medium leading-normal md:leading-[1.3]">:</span>
              <input
                className="w-full text-18 md:text-20 font-medium leading-[1.3] outline-none text-center"
                inputMode="numeric"
                maxLength={2}
                value={session.startTimeMinute}
                onChange={(e) => {
                  const numeric = e.target.value.replace(/\D/g, '').slice(0, 2);

                  if (numeric === '') {
                    setContents((prev) => ({
                      ...prev,
                      sessions: prev.sessions.map((session, i) =>
                        i === index ? { ...session, startTimeMinute: '' } : session,
                      ),
                    }));
                    return;
                  }

                  let minute = parseInt(numeric, 10);

                  if (minute < 1) minute = 0;
                  if (minute > 60) minute = 60;

                  setContents((prev) => ({
                    ...prev,
                    sessions: prev.sessions.map((session, i) =>
                      i === index ? { ...session, startTimeMinute: String(minute) } : session,
                    ),
                  }));
                }}
                onBlur={() => {
                  setContents((prev) => ({
                    ...prev,
                    sessions: prev.sessions.map((session, i) =>
                      i === index
                        ? {
                            ...session,
                            startTimeMinute: String(session.startTimeMinute).padStart(2, '0'),
                          }
                        : session,
                    ),
                  }));
                }}
              />
            </div>
          </div>
          <div className="h-13 md:h-15 grid grid-cols-[auto_1fr] items-center gap-6">
            <span className="text-16 md:text-18 font-semibold leading-[1.3]">종료 시간</span>
            <div className="box-style h-full grid grid-cols-[64px_1fr_auto_1fr] md:grid-cols-[80px_1fr_auto_1fr] items-center">
              <div className="flex items-center justify-center">
                <Button
                  variant={'line'}
                  size={'small'}
                  className="w-[52px]"
                  onClick={() => {
                    setContents((prev) => ({
                      ...prev,
                      sessions: prev.sessions.map((session, i) =>
                        i === index
                          ? { ...session, endMeridiem: session.endMeridiem === 'am' ? 'pm' : 'am' }
                          : session,
                      ),
                    }));
                  }}
                >
                  {session.endMeridiem === 'am' ? '오전' : '오후'}
                </Button>
              </div>
              <input
                className="w-full text-18 md:text-20 font-medium leading-[1.3] outline-none text-center"
                inputMode="numeric"
                maxLength={2}
                value={session.endTimeHour}
                onChange={(e) => {
                  const numeric = e.target.value.replace(/\D/g, '').slice(0, 2);

                  if (numeric === '') {
                    setContents((prev) => ({
                      ...prev,
                      sessions: prev.sessions.map((session, i) =>
                        i === index ? { ...session, endTimeHour: '' } : session,
                      ),
                    }));
                    return;
                  }

                  let hour = parseInt(numeric, 10);

                  if (hour < 1) hour = 0;
                  if (hour > 12) hour = 12;

                  setContents((prev) => ({
                    ...prev,
                    sessions: prev.sessions.map((session, i) =>
                      i === index ? { ...session, endTimeHour: String(hour) } : session,
                    ),
                  }));
                }}
                onBlur={() => {
                  setContents((prev) => ({
                    ...prev,
                    sessions: prev.sessions.map((session, i) =>
                      i === index
                        ? { ...session, endTimeHour: String(session.endTimeHour).padStart(2, '0') }
                        : session,
                    ),
                  }));
                }}
              />
              <span className="text-18 font-medium leading-normal md:leading-[1.3]">:</span>
              <input
                className="w-full text-18 md:text-20 font-medium leading-[1.3] outline-none text-center"
                inputMode="numeric"
                maxLength={2}
                value={session.endTimeMinute}
                onChange={(e) => {
                  const numeric = e.target.value.replace(/\D/g, '').slice(0, 2);

                  if (numeric === '') {
                    setContents((prev) => ({
                      ...prev,
                      sessions: prev.sessions.map((session, i) =>
                        i === index ? { ...session, endTimeMinute: '' } : session,
                      ),
                    }));
                    return;
                  }

                  let minute = parseInt(numeric, 10);

                  if (minute < 1) minute = 0;
                  if (minute > 60) minute = 60;

                  setContents((prev) => ({
                    ...prev,
                    sessions: prev.sessions.map((session, i) =>
                      i === index ? { ...session, endTimeMinute: String(minute) } : session,
                    ),
                  }));
                }}
                onBlur={() => {
                  setContents((prev) => ({
                    ...prev,
                    sessions: prev.sessions.map((session, i) =>
                      i === index
                        ? {
                            ...session,
                            endTimeMinute: String(session.endTimeMinute).padStart(2, '0'),
                          }
                        : session,
                    ),
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col gap-2">
          <Heading variant="h2">활동 내용</Heading>
          <Heading variant="h4" isDescription>
            날짜별 활동 내용을 간단히 적어주세요
          </Heading>
        </div>
        <div>
          <Textarea
            placeholder="활동 내용을 간단히 입력해주세요"
            value={session.activityContent}
            maxLength={800}
            minLength={8}
            autoResize
            onChange={(e) => {
              // 연속된 줄바꿈을 최대 2개로 제한
              let value = e.target.value.replace(/\n{3,}/g, '\n\n');
              // 연속된 공백과 탭만 하나로 치환 (줄바꿈은 유지)
              value = value.replace(/[ \t]{2,}/g, ' ');
              setContents((prev) => ({
                ...prev,
                sessions: prev.sessions.map((session, i) =>
                  i === index ? { ...session, activityContent: value } : session,
                ),
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SessionComponent;

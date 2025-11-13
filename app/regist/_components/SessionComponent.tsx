import Button from '@/components/button/Button';
import Heading from '@/components/heading/Heading';
import XIcon from '@/components/icons/XIcon';
import Textarea from '@/components/textarea/Textarea';
import { Contents, SessionContent } from '@/models/contents';
import { useCallback } from 'react';

interface SessionProps {
  session: SessionContent;
  setContents: React.Dispatch<React.SetStateAction<Contents>>;
  index: number;
  isMultiple?: boolean;
}

const SessionComponent = ({ session, setContents, index, isMultiple = false }: SessionProps) => {
  const handleRemoveSession = useCallback(() => {
    setContents((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== index),
    }));
  }, [setContents, index]);

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
          <div className="h-13 md:h-15 grid grid-cols-[auto_1fr] items-center gap-6">
            <span className="text-16 md:text-18 font-semibold leading-[1.3]">날짜 선택</span>
            <div className="box-style px-4 h-full text-[#8F8F8F] text-16 md:text-20 font-medium leading-[1.3] flex items-center justify-center cursor-pointer">
              날짜를 선택해주세요
            </div>
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
            onChange={(e) =>
              setContents((prev) => ({
                ...prev,
                sessions: prev.sessions.map((session, i) =>
                  i === index ? { ...session, activityContent: e.target.value } : session,
                ),
              }))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SessionComponent;

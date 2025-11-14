import CustomDayPicker from '@/components/customDayPicker/CustomDayPicker';
import Heading from '@/components/heading/Heading';
import XIcon from '@/components/icons/XIcon';
import Select, { SelectValueType } from '@/components/select/Select';
import Textarea from '@/components/textarea/Textarea';
import { minuteOptions, timeOptions } from '@/data/time';
import useToast from '@/hooks/useToast';
import { Contents } from '@/models/contents';
import { addOneHour, convert24HourToTime, convertTimeTo24Hour } from '@/utils/calcTime';
import clsx from 'clsx';
import { addDays, format, subDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SessionProps {
  contents: Contents;
  setContents: React.Dispatch<React.SetStateAction<Contents>>;
  index: number;
  isMultiple?: boolean;
}

/**
 * SessionComponent - 회차별 정보 입력 컴포넌트
 *
 * 각 회차의 날짜, 시간, 활동 내용을 입력받는 컴포넌트입니다.
 * 다중 회차 지원으로 여러 개의 SessionComponent가 동시에 렌더링될 수 있습니다.
 *
 * @features
 * - 날짜 선택: CustomDayPicker를 통한 날짜 선택
 *   - 이전/다음 회차와의 날짜 충돌 방지 (minDate/maxDate 자동 계산)
 * - 시간 입력: 24시간 형식 셀렉트 박스 (Figma 시안과 다른 UX 개선)
 *   - 시작 시간 변경 시 종료 시간 자동 조정 (1시간 후)
 *   - 종료 시간 검증 (시작 시간보다 빠를 수 없음)
 * - 활동 내용: 텍스트 입력 (8자 이상, 최대 800자)
 * - 회차 삭제: 다중 회차일 때만 삭제 버튼 표시
 *
 * @state-management
 * - 부모 컴포넌트(RegistContent)의 contents 상태를 직접 수정
 * - index prop으로 현재 회차를 식별
 */
const SessionComponent = ({ contents, setContents, index, isMultiple = false }: SessionProps) => {
  // 날짜 선택기 열림/닫힘 상태
  const [openDayPicker, setOpenDayPicker] = useState(false);
  const dayPickerRef = useRef<HTMLDivElement>(null);
  const dayPickerBoxRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  /**
   * 현재 회차의 세션 데이터
   * useMemo로 최적화하여 불필요한 리렌더링 방지
   */
  const session = useMemo(() => contents.sessions[index], [contents, index]);

  /**
   * 외부 클릭 감지로 날짜 선택기 닫기
   *
   * @ux-pattern
   * 사용자가 날짜 선택기 외부를 클릭하면 자동으로 닫히도록 합니다.
   * dayPickerRef와 dayPickerBoxRef 모두 체크하여 정확한 외부 클릭 감지
   */
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

  /**
   * 회차 삭제 핸들러
   *
   * 다중 회차일 때만 표시되는 삭제 버튼의 핸들러입니다.
   * sessions 배열에서 현재 index의 회차를 제거합니다.
   */
  const handleRemoveSession = useCallback(() => {
    setContents((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== index),
    }));
  }, [setContents, index]);

  /**
   * 날짜 선택 핸들러
   *
   * CustomDayPicker에서 날짜를 선택하면 호출됩니다.
   * 현재 회차의 date만 업데이트하고 다른 회차는 유지합니다.
   */
  const handleSelectDate = useCallback(
    (date: Date | null) => {
      setContents((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session, i) => (i === index ? { ...session, date } : session)),
      }));
    },
    [contents, index, setContents],
  );

  /**
   * 시작 시간 변경 핸들러
   *
   * @auto-adjustment
   * 시작 시간이 변경되면 종료 시간을 자동으로 시작 시간 + 1시간으로 조정합니다.
   * 이는 사용자가 시간을 빠르게 설정할 수 있도록 하는 UX 개선입니다.
   *
   * @time-calculation
   * - 시간을 분 단위로 변환하여 계산 (24시간 = 1440분)
   * - addOneHour: 시작 시간 + 60분 (최대 23:55까지)
   * - convert24HourToTime: 분 단위를 다시 시간/분 문자열로 변환
   *
   * @note
   * - key 파라미터로 'startTimeHour' 또는 'startTimeMinute' 구분
   * - 종료 시간은 항상 시작 시간보다 1시간 후로 자동 설정
   */
  const handleStartTimeChange = useCallback(
    (value: string, key: string) => {
      const startHour = key === 'startTimeHour' ? value : session.startTimeHour;
      const startMinute = key === 'startTimeMinute' ? value : session.startTimeMinute;
      const endHour = session.endTimeHour;
      const endMinute = session.endTimeMinute;

      // 시간을 분 단위로 변환하여 계산
      const startTime = convertTimeTo24Hour(startHour, startMinute);
      const endTime = convertTimeTo24Hour(endHour, endMinute);
      const newEndTime = addOneHour(startTime);
      const { hour, minute } = convert24HourToTime(newEndTime);

      setContents((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session, i) =>
          i === index
            ? {
                ...session,
                [key]: value,
                endTimeHour: hour,
                endTimeMinute: minute,
              }
            : session,
        ),
      }));
    },
    [contents],
  );

  /**
   * 종료 시간 변경 핸들러
   *
   * @validation
   * 종료 시간이 시작 시간보다 빠르거나 같으면 에러 메시지를 표시하고 업데이트를 취소합니다.
   *
   * @time-calculation
   * - 시간을 분 단위로 변환하여 비교
   * - 시작 시간 >= 종료 시간인 경우 검증 실패
   */
  const handleEndTimeChange = useCallback(
    (value: string, key: string) => {
      const startHour = session.startTimeHour;
      const startMinute = session.startTimeMinute;
      let endHour = key === 'endTimeHour' ? value : session.endTimeHour;
      let endMinute = key === 'endTimeMinute' ? value : session.endTimeMinute;

      // 시간을 분 단위로 변환하여 비교
      const startTime = convertTimeTo24Hour(startHour, startMinute);
      const endTime = convertTimeTo24Hour(endHour, endMinute);

      // 종료 시간이 시작 시간보다 빠르거나 같으면 검증 실패
      if (startTime >= endTime) {
        toast('시작 시간보다 종료시간은 빠를 수 없습니다.');
        return;
      }

      setContents((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session, i) =>
          i === index ? { ...session, endTimeHour: endHour, endTimeMinute: endMinute } : session,
        ),
      }));
    },
    [contents, index, setContents],
  );

  return (
    <div className="relative py-6 md:py-7 px-4 md:px-5 flex flex-col gap-8 bg-[#F7F7F8] rounded-lg">
      {/* 
        회차 삭제 버튼
        - 다중 회차일 때만 표시 (isMultiple === true)
        - 우측 상단에 고정 위치
      */}
      {isMultiple && (
        <div
          className="absolute top-0 right-0 flex items-center justify-center w-12 h-12"
          onClick={handleRemoveSession}
        >
          <XIcon className="w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-[#F7F7F8] cursor-pointer" />
        </div>
      )}

      {/* 회차 정보 섹션 */}
      <div className="flex flex-col gap-4">
        <Heading variant="h2">{isMultiple ? `${index + 1}회차 정보` : '회차 정보'}</Heading>
        <div className="flex flex-col gap-3">
          {/* 날짜 선택 */}
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
                /**
                 * minDate: 이전 회차의 날짜 + 1일
                 *
                 * @logic
                 * 현재 회차보다 앞선 회차들 중 가장 최근 회차의 날짜를 찾아
                 * 그 다음 날을 최소 날짜로 설정합니다.
                 * 이렇게 하면 회차들이 시간순으로 정렬되도록 강제합니다.
                 *
                 * @example
                 * - 1회차: 2024-01-01
                 * - 2회차: minDate = 2024-01-02 (1회차 다음 날)
                 */
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
                /**
                 * maxDate: 다음 회차의 날짜 - 1일
                 *
                 * @logic
                 * 현재 회차보다 뒤의 회차들 중 가장 가까운 회차의 날짜를 찾아
                 * 그 전 날을 최대 날짜로 설정합니다.
                 *
                 * @example
                 * - 2회차: 2024-01-05
                 * - 1회차: maxDate = 2024-01-04 (2회차 전 날)
                 */
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

          {/* 
            [UX 개선] Figma 시안과의 차이점
            - Figma 시안: 오전/오후 토글 버튼 + 시간/분 텍스트 입력
            - 현재 구현: 24시간 형식 셀렉트 박스
            
            변경 이유:
            1. 사용성 개선: 텍스트 입력 시 키보드를 다시 열어야 하는 불편함 제거
               - 모바일 환경에서 키보드 전환이 사용자 경험을 저해할 수 있음
            2. 시간 표현의 명확성: 오전/오후 12시의 모호함 해소
               - 00시(자정)와 12시(정오)의 혼동 가능성
               - 자정 12시가 당일 시작인지 다음날을 의미하는지 불명확
               - 24시간 형식은 시간의 순서와 범위를 직관적으로 표현
          */}
          {/* 시작 시간 입력 */}
          <div className="h-13 md:h-15 grid grid-cols-[auto_1fr] items-center gap-6">
            <span className="text-16 md:text-18 font-semibold leading-[1.3]">시작 시간</span>
            <div className="box-style h-full grid grid-cols-[1fr_auto_1fr] items-center">
              <Select
                options={timeOptions}
                value={session.startTimeHour}
                onChange={(value: SelectValueType) =>
                  handleStartTimeChange(value as string, 'startTimeHour')
                }
              />
              <span className="text-18 font-medium leading-normal md:leading-[1.3]">:</span>
              <Select
                options={minuteOptions}
                value={session.startTimeMinute}
                onChange={(value: SelectValueType) =>
                  handleStartTimeChange(value as string, 'startTimeMinute')
                }
              />
            </div>
          </div>

          {/* 종료 시간 입력 */}
          <div className="h-13 md:h-15 grid grid-cols-[auto_1fr] items-center gap-6">
            <span className="text-16 md:text-18 font-semibold leading-[1.3]">종료 시간</span>
            <div className="box-style h-full grid grid-cols-[1fr_auto_1fr] items-center">
              <Select
                options={timeOptions}
                value={session.endTimeHour}
                onChange={(value) => {
                  handleEndTimeChange(value as string, 'endTimeHour');
                }}
              />
              <span className="text-18 font-medium leading-normal md:leading-[1.3]">:</span>
              <Select
                options={minuteOptions}
                value={session.endTimeMinute}
                onChange={(value) => {
                  handleEndTimeChange(value as string, 'endTimeMinute');
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 활동 내용 섹션 */}
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
              /**
               * 텍스트 입력 정규화
               *
               * @normalization
               * - 연속된 줄바꿈을 최대 2개로 제한: 과도한 공백 방지
               * - 연속된 공백과 탭을 하나로 치환: 불필요한 공백 제거
               * - 줄바꿈은 유지: 사용자가 의도한 포맷 보존
               *
               * @note
               * 이 정규화는 사용자 입력을 제한하는 것이 아니라
               * 데이터 일관성과 저장 공간 최적화를 위한 것입니다.
               */
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

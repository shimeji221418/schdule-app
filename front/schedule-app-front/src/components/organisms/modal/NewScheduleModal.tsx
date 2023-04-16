import { NewScheduleType, scheduleType } from "@/types/api/schedule";
import { GetTaskType } from "@/types/api/schedule_kind";
import { TeamType } from "@/types/api/team";
import {
  Checkbox,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { app } from "../../../../firebase";
import { getAuth } from "firebase/auth";
import React, { ChangeEvent, FC, memo, useEffect, useState } from "react";
import SelectForm from "../../atoms/SelectForm";
import { ChangeHandler, useFormContext } from "react-hook-form";
import FormButton from "../../atoms/FormButton";
import { useAuthContext } from "@/provider/AuthProvider";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { hours, minutes } from "../../atoms";
import { EndTimeType, StartTimeType } from "@/types";
import { TargetUserType } from "@/app/page";
import { GetUserType } from "@/types/api/user";
import { format } from "date-fns";
import ErrorMessageModal from "./ErrorMessageModal";
import { useErrorMessage } from "@/hooks/schedule/useErrorMessage";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  targetUser?: GetUserType;
  teamUser?: Array<GetUserType>;
  tasks: Array<GetTaskType>;
  weeklySchedules?: Array<scheduleType>;
};

const NewScheduleModal: FC<Props> = memo((props) => {
  const {
    isOpen,
    onClose,
    date,
    tasks,
    targetUser,
    teamUser,
    weeklySchedules,
  } = props;
  const auth = getAuth(app);
  const { loginUser } = useAuthContext();
  const { handleSubmit } = useFormContext();
  const { isErrorMessage, message, errorModalOpen, errorModalClose } =
    useErrorMessage();
  const [selectDay, setSelectDay] = useState<string>("");
  const [startTime, setStartTime] = useState<StartTimeType>({
    startHour: "",
    startMinutes: "",
  });
  const [endTime, setEndTime] = useState<EndTimeType>({
    endHour: "",
    endMinutes: "",
  });

  const [newSchedule, setNewSchedule] = useState<NewScheduleType>({
    start_at: "",
    end_at: "",
    is_Locked: false,
    description: "",
    user_id: 0,
    schedule_kind_id: 0,
  });

  useEffect(() => {
    if (targetUser) {
      setNewSchedule({ ...newSchedule, user_id: targetUser.id });
    }
    if (date) {
      setSelectDay(date);
    }
  }, [targetUser, date]);

  const handleStartTimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setStartTime({ ...startTime, [name]: value });
  };
  useEffect(() => {
    setNewSchedule({
      ...newSchedule,
      start_at: `${selectDay} ${startTime.startHour}:${startTime.startMinutes}`,
    });
  }, [startTime, selectDay]);

  const handleEndTimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setEndTime({ ...endTime, [name]: value });
  };
  useEffect(() => {
    setNewSchedule({
      ...newSchedule,
      end_at: `${selectDay} ${endTime.endHour}:${endTime.endMinutes}`,
    });
  }, [endTime, selectDay]);

  const handleonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setNewSchedule({ ...newSchedule, [name]: value });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setNewSchedule({ ...newSchedule, [name]: value });
  };

  const overlapSchedules: scheduleType[] | undefined = weeklySchedules?.filter(
    (schedule) =>
      schedule.userId == newSchedule.user_id &&
      new Date(schedule.startAt) < new Date(newSchedule.end_at) &&
      new Date(schedule.endAt) > new Date(newSchedule.start_at)
  );

  const timeCheck =
    new Date(newSchedule.start_at) >= new Date(newSchedule.end_at);

  const handleonSubmit = () => {
    const createSchedule = async () => {
      try {
        if (loginUser && targetUser) {
          if (timeCheck) {
            errorModalOpen("終了時刻が開始時刻より早く設定されています");
          } else if (overlapSchedules?.length !== 0) {
            const errorMessage = overlapSchedules?.map(
              (schedule) => schedule.description
            );
            errorModalOpen(
              `同時間帯に "${errorMessage}" が既に登録されています`
            );
          } else {
            const token = await auth.currentUser?.getIdToken(true);
            const data = {
              schedule: {
                start_at: newSchedule.start_at,
                end_at: newSchedule.end_at,
                is_Locked: newSchedule.is_Locked,
                description: newSchedule.description,
                schedule_kind_id: newSchedule.schedule_kind_id,
                user_id: newSchedule.user_id,
              },
            };
            const props: BaseClientWithAuthType = {
              method: "post",
              url: "/schedules/",
              token: token!,
              params: data,
            };
            const res = await BaseClientWithAuth(props);
            console.log(res.data);
            onClose();
          }
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    createSchedule();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Schedule</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(handleonSubmit)}>
            <ModalBody>
              <Stack spacing={3}>
                {teamUser ? (
                  <SelectForm
                    title="User"
                    name="user_id"
                    handleonChange={handleSelectChange}
                    teamUsers={teamUser}
                    value={newSchedule.user_id}
                    message="Userが入力されていません"
                  />
                ) : (
                  <InputGroup>
                    <InputLeftAddon
                      children="User"
                      bg="cyan.600"
                      color="white"
                    />
                    <Input value={targetUser?.name} isReadOnly={true} />
                  </InputGroup>
                )}

                <InputGroup>
                  <InputLeftAddon children="日時" bg="cyan.600" color="white" />
                  <Input
                    name="date"
                    type="date"
                    placeholder="日付"
                    value={selectDay}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSelectDay(e.target.value)
                    }
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon children="開始" bg="cyan.600" color="white" />
                  <Select
                    name="startHour"
                    placeholder="時間"
                    onChange={handleStartTimeChange}
                    required
                  >
                    {hours && (
                      <>
                        {hours.map((hour, i) => (
                          <option key={i} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </>
                    )}
                  </Select>
                  <Select
                    name="startMinutes"
                    placeholder="分"
                    onChange={handleStartTimeChange}
                    required
                  >
                    {minutes && (
                      <>
                        {minutes.map((minute, i) => (
                          <option key={i} value={minute}>
                            {minute}
                          </option>
                        ))}
                      </>
                    )}
                  </Select>
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon children="終了" bg="cyan.600" color="white" />
                  <Select
                    name="endHour"
                    placeholder="時間"
                    onChange={handleEndTimeChange}
                    required
                  >
                    {hours && (
                      <>
                        {hours.map((hour, i) => (
                          <option key={i} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </>
                    )}
                  </Select>
                  <Select
                    name="endMinutes"
                    placeholder="分"
                    onChange={handleEndTimeChange}
                    required
                  >
                    {minutes && (
                      <>
                        {minutes.map((minute, i) => (
                          <option key={i} value={minute}>
                            {minute}
                          </option>
                        ))}
                      </>
                    )}
                  </Select>
                </InputGroup>
                <SelectForm
                  title="カテゴリー"
                  name="schedule_kind_id"
                  handleonChange={handleSelectChange}
                  tasks={tasks}
                  message="カテゴリーが入力されていません"
                />
                <InputGroup>
                  <InputLeftAddon children="詳細" bg="cyan.600" color="white" />
                  <Textarea
                    name="description"
                    placeholder="詳細"
                    rows={1}
                    onChange={handleonChange}
                  />
                </InputGroup>
                <Checkbox
                  name="is_Locked"
                  onChange={() =>
                    setNewSchedule({
                      ...newSchedule,
                      is_Locked: !newSchedule.is_Locked,
                    })
                  }
                >
                  Locked
                </Checkbox>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <FormButton type="submit" color="cyan" size="md">
                create
              </FormButton>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <ErrorMessageModal
        isOpen={isErrorMessage}
        onClose={errorModalClose}
        message={message}
      />
    </>
  );
});

export default NewScheduleModal;

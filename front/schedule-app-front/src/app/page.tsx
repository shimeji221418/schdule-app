"use client";
import { getAuth, getIdToken, signOut } from "firebase/auth";
import { app } from "../../firebase";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/provider/AuthProvider";
import { useEffect, useState } from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
  subDays,
} from "date-fns";
import { Box } from "@chakra-ui/react";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { GetUserType } from "@/types/api/user";

export default function Home() {
  const auth = getAuth(app);
  const router = useRouter();
  const [teamUser, setTeamUser] = useState<Array<GetUserType>>([]);
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
    console.log(auth.currentUser);
  };
  const { loginUser, loading, setLoading } = useAuthContext();
  const today: Date = new Date();
  const [date, setDate] = useState<Date>(today);
  const nextWeek = () => setDate(addDays(date, 7));
  const prevWeek = () => setDate(subDays(date, 7));
  const thisWeek = () => setDate(today);
  const dates = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date),
  });

  useEffect(() => {
    const getTeamUsers = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        if (loginUser) {
          const data = { team_id: loginUser.teamId };
          const props: BaseClientWithAuthType = {
            method: "get",
            url: "/users/team_users",
            token: token!,
            params: data,
          };
          const res = await BaseClientWithAuth(props);
          setTeamUser(res.data);
          setLoading(false);
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    getTeamUsers();
  }, []);

  return (
    <>
      {!loading && (
        <>
          {teamUser.map((user) => (
            <Box key={user.id}>{user.name}</Box>
          ))}
          <PrimaryButton size="xs" color="cyan" onClick={handleLogout}>
            logout
          </PrimaryButton>
          <PrimaryButton size="xs" color="yellow" onClick={prevWeek}>
            prevWeek
          </PrimaryButton>
          <PrimaryButton size="xs" color="pink" onClick={nextWeek}>
            NextWeek
          </PrimaryButton>
          <PrimaryButton size="xs" color="green" onClick={thisWeek}>
            ThisWeek
          </PrimaryButton>
          {dates.map((day, i) => (
            <Box key={i}>{format(day, "MM-dd E")}</Box>
          ))}
        </>
      )}
    </>
  );
}

// import {format} from 'date-fns'
// import {eachDayOfInterval} from 'date-fns'
// import eachWeekOfInterval from 'date-fns/eachWeekendOfInterval'
// import endOfWeek from 'date-fns/endOfWeek'
// import startOfWeek from 'date-fns/startOfWeek'
// import addDays from 'date-fns/addDays'
// import subDays from 'date-fns/subDays'
// import { useState } from 'react'
// import styles from './calendar.module.scss'
// import Modals from './Modals.js'
// import addHours from 'date-fns/addHours'

// const Calendar =()=>{

//     const today = new Date()
//     const now = format(today, 'yyyy-MM-dd E')
//     const newdate = addDays(today , 7)
//     const afteraweek = format(newdate , 'yyyy-MM-dd E')

//     const [date , setdate] = useState(today)
//     const [isModalOpen , setIsModalOpen] = useState({ isOpen: false, startDate: null })
//     const [checked , setChecked] = useState(today)
//     const [slots, setSlots] = useState([])
//     // {startDate: new Date('2022-06-25 10:00')}

//     const handleOnSubmit = (newDay)=>{
//       const newSlot = {newDay}
//       setSlots([...slots , newSlot])
//       console.log(slots)
//       setIsModalOpen({isOpen: false, startDate: null})
//     }

//     const dates = eachDayOfInterval(
//           {start: startOfWeek(date), end: endOfWeek(date)}
//           )

//     const addweek = () =>{
//       setdate(addDays(date , 7))
//     }

//     const subweek =()=>{
//       setdate(subDays(date , 7))
//     }

//     const currentweek =()=>{
//       setdate(today)
//     }

//     const openSchedule =(day,index)=>{
//       setIsModalOpen({isOpen: true,startDate: addHours(day , index)})
//       console.log(addHours(day,index))

//     }

//     const closeSchedule =()=>{
//       setIsModalOpen(false)
//     }

//     const handleChecked =()=>{
//       setChecked(true)
//     }

//     const handleUnChecked =()=>{
//       setChecked(false)
//     }

//   return(

//     <div className={styles.container}>
//         <h1 className={styles.title}>{now}</h1>
//         <h2>{afteraweek}</h2>
//         <div>
//         <button onClick={subweek}>一週前</button>
//         <button onClick={currentweek}>現在</button>
//         <button onClick={addweek}>一週後</button>
//         </div>

//       <div style={{float:"left",position:"relative",marginTop:"40px"}}>
//         {[...Array(24)].map((_,i)=>(
//           <div  key={i} style={{marginBottom:"30px"}}>
//             {`${i}:00`}
//           </div>
//         ))}
//       </div>

//       {dates.map((day,e)=>(
//       <div  key={e} style={{marginTop:"0" ,float:"left"}}>
//         <div  className={styles.week}>
//           {format(day , 'MM-dd E')}
//         </div>
//           <div style={{ position:'relative'}}>
//             {[...Array(24)].map((_,index)=>
//             <div key={index} onClick={()=>{openSchedule(day, index)}} className={styles.sample1}></div>)}
//             <div style={{width:"100px", height:"55px", backgroundColor:"rgba(42, 199, 63,.5)", position:"absolute",top:"55px"}}></div>
//           </div>
//       </div>

//     ))}

// <div>{slots.map((slot)=><p>{format(slot.newDay, 'yyyy-MM-dd E p')}</p>)}</div>

//     <Modals isModalOpen={isModalOpen} closeSchedule={closeSchedule} handleChecked={handleChecked} handleUnChecked={handleUnChecked} OnSubmit={handleOnSubmit}/>

//   </div>

//   )

// }

// import Modal from "react-bootstrap/Modal";
// import { Button } from "react-bootstrap";
// import { addHours, format } from "date-fns";
// import styles from "./Modals.module.scss";

// const Modals = ({isModalOpen , closeSchedule, handleChecked, handleUnChecked, OnSubmit})=>{

//     if(isModalOpen.isOpen){
//         return(
//           <div className={styles.modal}>
//             <Modal.Dialog>
//               <Modal.Header onClick={closeSchedule} closeButton>
//                 <Modal.Title>個別スロット設定</Modal.Title>
//               </Modal.Header>

//                 <Modal.Body>
//                   <label>取材可
//                     <input type='radio' name='aradio' onClick={()=>handleChecked(isModalOpen)}/>
//                   </label>
//                     <label>
//                       取材NG<input type='radio' name='aradio' onClick={handleUnChecked}/>
//                     </label>
//                       <p>期間</p>
//                         <p>{format(isModalOpen.startDate, 'yyyy-MM-dd E')}</p>
//                           <p>時間帯</p>
//                             <p>{format(isModalOpen.startDate,'p')}～{format(addHours(isModalOpen.startDate , 1),'p')}</p>
//                 </Modal.Body>

//                 <Modal.Footer>
//                   <Button onClick={closeSchedule} variant="secondary">Close</Button>
//                   <Button variant="primary" onClick={()=>OnSubmit(isModalOpen.startDate)}>Save</Button>
//                 </Modal.Footer>
//               </Modal.Dialog>
//           </div>

//         )
//     }

// }

// export default Modals

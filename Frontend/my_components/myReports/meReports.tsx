import React, { useEffect, useState } from 'react'
import ReportTop from './ReportTop'
import ReportHero from './ReportHero'
import axios from '@/utils/axios'
import { BACKEND_URI } from '@/CONSTANTS'
import { useRouter } from 'next/navigation'
import { logout } from '@/Helpers/logout'
import { ReportsSchema } from '@/Interfaces'
import { ReportsData } from '@/Data/ReportsData'
import { getReportsList } from '@/Helpers/apiCalls'
import ShimmerUi from './ShimmerUi'

interface Props {}

function ReportMain(props: Props) {
    const Router = useRouter();
    const [reportSearch, setReportSearch] = React.useState<string>("");
    const [reportFound,setReportFound]=useState("false");
    const [reportsList, setReportsList] = useState<ReportsSchema[]>([]);
    useEffect(() => {
        const checkTokens = async () => {
            try {
              const accessTokenResponse = await axios.post(
                `${BACKEND_URI}/auth/verifyAccessToken`,
              );
              if (accessTokenResponse.status !== 200) {
                Router.push("/login");
                logout() 
                return;
              }
              if(accessTokenResponse.data.data.isDoctor){
                  Router.push("sections/myPatients");
              }
            } catch (error) {
              Router.push("/login");
              logout()
              console.log("Access token invalid, trying refresh token...");
            }
        };
        
setTimeout(async ()=>{

         const reports=await getReportsList(setReportsList)
          setReportFound("true");
       },500);
               
        
        checkTokens();
    }, [Router]);

    return (
        <div className='flex-grow flex flex-col width-full h-full mr-6'>
            <ReportTop reportSearch = {reportSearch} setReportSearch = {setReportSearch} setReportsList={setReportsList}/>
            {
              reportFound==="false"?<ShimmerUi/>: <ReportHero data={reportsList} reportSearch = {reportSearch}/>
            }
           
        </div>
    )
}

export default ReportMain

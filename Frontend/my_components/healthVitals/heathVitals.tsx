import React, { useEffect } from 'react'
// import ReportHero from '../ReportHero/ReportHero'
import ReportTop from '../myReports/ReportTop'
import { ReportsData } from '@/Data/ReportsData'
import ReportHero from '../myReports/ReportHero'
import VitalsTop from './VitalsTop'
import VitalsHero from './VitalsHero'
import { useRouter } from 'next/navigation'
import axios from '@/utils/axios'
import { BACKEND_URI } from '@/CONSTANTS'
import { logout } from '@/Helpers/logout'
import { HealthGraphs } from '@/Data/HealthGraphs'
// import CartHero from '../cartHero/cartHero'


function VitalsMain() {
    const Router = useRouter();
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
        checkTokens();
    }, [Router])
    const [searchVitals, setSearchVitals] = React.useState<string>("");

    return (
        <div className='flex-grow flex flex-col width-full h-full mr-6'>
            <VitalsTop searchVitals={searchVitals} setSearchVitals={setSearchVitals}/>
            <VitalsHero searchVitals={searchVitals} data={HealthGraphs}/>
        </div>
    )
}

export default VitalsMain

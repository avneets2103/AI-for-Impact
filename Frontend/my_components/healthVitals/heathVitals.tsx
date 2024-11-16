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
import { GraphSchema } from '@/Interfaces'

function VitalsMain() {
    const Router = useRouter();
    const [HealthGraphs, setHealthGraphs] = React.useState<Array<GraphSchema>>([]);
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
        const getGraphs = async () => {
            try {
                const response = await axios.post(`${BACKEND_URI}/patient/getCharts`);
                setHealthGraphs(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getGraphs();
        checkTokens();
    }, [Router])
    const [searchVitals, setSearchVitals] = React.useState<string>("");

    return (
        <div className='flex-grow flex flex-col width-full h-full mr-6'>
            <VitalsTop searchVitals={searchVitals} setSearchVitals={setSearchVitals} setHealthGraphs={setHealthGraphs}/>
            <VitalsHero searchVitals={searchVitals} data={HealthGraphs} setHealthGraphs={setHealthGraphs}/>
        </div>
    )
}

export default VitalsMain

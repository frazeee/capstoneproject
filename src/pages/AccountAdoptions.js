import { BeatLoader } from "react-spinners";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../components/client";
import Cookies from "js-cookie";

const AccountAdoptions = () => {
    const [loading, setLoading] = useState(null)
    const [userRequests, setUserRequests] = useState(null)
    const userData = JSON.parse(Cookies.get('userSession'))
    const email = userData.data.user.email
    

    useEffect(() => {
        const fetchRequests = async () => {
          try {
            setLoading(true)
            const { data: Requests, error } = await supabase
              .from('Requests')
              .select(
                `
                  *,
                  Pets (
                      id,
                      pet_name,
                      Shelter
                  )
                  `
              )
              .eq('email', email);
    
            if (error) {
              throw error;
            }
    
            setUserRequests(Requests); // Update state with fetched data
          } catch (error) {
            console.error("An error occurred:", error);
          } finally {
            setLoading(false)
          }
        };
    
        fetchRequests();
      }, [email]);
    
    console.log(userRequests)
    
    return(
        <>
        <Navbar />
        <h1 className="text-center mt-3">Your Adoption Requests</h1>
        <hr />
        <div className="container mt-3">
          {loading ? (
            <>
             <div className="d-flex justify-content-center align-items-center mt-5">
                <BeatLoader type="ThreeDots" color="#fee481" height={200} width={200} className="spinner" />
             </div>
            <h5 className='text-warning text-center'>Fetching Requests...</h5>
            </>
          ) : (
            <div className="table-responsive">
            <table className="table border border-2">
              <thead className="table-warning">
                <th scope="col"></th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Pet Name</th>
                <th scope="col">Interview Date Time</th>
                <th scope="col">Shelter</th>
                <th scope="col">Status</th>
              </thead>
              {userRequests &&
                userRequests.map((request, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{request.first_name}</td>
                    <td>{request.last_name}</td>
                    <td>{request.Pets.pet_name}</td>
                    <td>
                      {new Date(request.interview_date).toLocaleString()}
                    </td>
                    <td >{request.Pets.Shelter}</td>
                    <td className={`badge mt-1 w-75 ${
                        request.adoption_status === 'For Verification' ? 'text-bg-primary' :
                        request.adoption_status === 'For Interview' ? 'text-bg-primary' :
                        request.adoption_status === 'Interview Done' ? 'text-light text-bg-info' :
                        request.adoption_status === 'Approved' ? 'text-bg-success':
                        request.adoption_status === "Rejected" && "text-bg-danger"
                      }`}>
                        {request.adoption_status}
                      </td>
                  </tr>
                ))}
            </table>
            </div>
          )}
        </div>
        </>
    )
}

export default AccountAdoptions;
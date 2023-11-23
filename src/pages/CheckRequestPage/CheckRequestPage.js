import { useEffect, useState } from "react";
import { supabase } from "../../components/client";
import axios from "axios";
import "./CheckRequestPage.css";
import { BeatLoader } from "react-spinners";
import Navbar from "../../components/Navbar";
import CheckApplicationFormModal from "../../components/CheckApplicationFormModal/CheckApplicationFormModal";


function CheckRequestPage() {
  const [requestDetails, setRequestDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const currentUrl = window.location.href;


  // Split the URL by slashes and get the last part
  const dataId = currentUrl.split("/").pop();

  useEffect(() => {
    getRequestData();
  }, []);

  const getRequestData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Requests")
        .select(
          `
            *,
            Pets (
                id,
                pet_name
            )
            `
        )
        .eq("id", dataId);

      console.log(data);
      setRequestDetails(data);
      setSelectedStatus(data.adoption_status)
      setRequestEmail(data[0].email)
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleCheckPictures = () => {
    const url = requestDetails[0].q_house_pic
    // Open the URL in a new tab
    window.open(url, '_blank');
  };

  const sendProcessUpdateEmail = async (status) => {
    try {
      setLoading(true)
      let subject, text;
  
      // Determine email content based on the status
      switch (status) {
        case 'For Verification':
          subject = 'Adoption Process Update: Document Verification';
          text = `Dear [User],
  
  Your adoption process is now at the "For Verification" stage. The respective shelter will review your submitted documents to ensure everything is in order. Thank you for your patience and cooperation.
  
  Best regards,
  [Your Organization]`;
          break;
        
        case 'For Interview':
          subject = 'Adoption Process Update: Interview Scheduled';
          text = `Dear [User],
  
  Exciting news! Your adoption process has progressed to the "For Interview" stage. The respective shelter will schedule an interview with you to discuss the adoption process further. Please let them know your availability.
  
  Best regards,
  [Your Organization]`;
          break;
        
        case 'Interview Done':
          subject = 'Adoption Process Update: Interview Completed';
          text = `Dear [User],
  
  Great news! Your interview for the adoption process has been successfully completed. We appreciate your time and effort in the process. Our team & the shelter will now review the interview results.
  
  Best regards,
  [Your Organization]`;
          break;
  
        case 'Approved':
          subject = 'Adoption Process Update: Approval Granted';
          text = `Dear [User],
  
  Congratulations! Your adoption process has been approved. We thank you for using the website as a gateway towards responsible adoption! The shelter will provide further instructions on the next steps.
  
  Best regards,
  [Your Organization]`;
          break;
  
        case 'Rejected':
          subject = 'Adoption Process Update: Regrettably Rejected';
          text = `Dear [User],
  
  We regret to inform you that your adoption request has been rejected.
  For reasons: 
  
  We appreciate your interest, and we understand that this news may be disappointing. If you have any questions or concerns, please don't hesitate to reach out to us.
  
  Best regards,
  [Your Organization]`;
          break;
  
        default:
          throw new Error('Invalid status');
      }
  
  
      text = text.replace('[User]', requestEmail);  
      text = text.replace('[Your Organization]', 'BPUAdopt');  
  
      await axios.post('https://bpuadopt.vercel.app/update-process/', {
        to: requestEmail, 
        subject,
        text, 
      });
      
      console.log('Process update email sent successfully');
    } catch (error) {
      console.error('Error sending process update email:', error);
    }
    finally{
      setLoading(false)
    }
  };
  

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Requests')
        .update({ adoption_status: selectedStatus })
        .eq('id', dataId)
        .select();
  
      await sendProcessUpdateEmail(selectedStatus);
  
      if (data) {
        setModalMessage(`Record updated successfully! An email has been sent to ${requestEmail}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setModalMessage('Error updating record.');
      setShowModal(true);
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };
  

  if (loading) {
    <>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <BeatLoader
          type="ThreeDots"
          color="#fee481"
          height={200}
          width={200}
          className="spinner"
        />
      </div>
    </>;
  }

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <div className="card my-3">
          <h1 className="text-center fw-semibold mt-3">
            Check Adoption Request
          </h1>
          <hr className="w-75 px-5 align-self-center" />
          <div className="card-body">
            {requestDetails.map((data) => (
              <>
                <div className="row">
                  <div className="col-xl-6">
                    <h2 className="text-primary">Adopters Details</h2>
                    <div className="form-group">
                      <label className="fs-5">
                        <strong>Adopters Name:</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={`${data.last_name}, ${data.first_name}`}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label className="fs-5">
                        <strong>Adopters Email:</strong>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={`${data.email}`}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label className="fs-5">
                        <strong>Adopters Contact Number:</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={`${data.phone_number}`}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label className="fs-5">
                        <strong>Adopters Occupation:</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={`${data.occupation}`}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <h2 className="text-primary">Adoption Status</h2>
                    <div className="form-group">
                      <label className="fs-5">
                        <strong>Pet To be Adopted:</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={`${data.Pets.pet_name}`}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label className="fs-5">
                        <strong>Interview Date:</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={new Date(
                          data.interview_date
                        ).toLocaleDateString()}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label className="fs-5">
                        <strong>Payment Status:</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={`${data.payment_status}`}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label className="fs-5">
                        <strong>Adoption Status:</strong>
                      </label>
                      <select
                        className="form-select"
                        defaultValue={data.adoption_status}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="For Verification">For Verification</option>
                        <option value="For Interview">For Interview</option>
                        <option value="Interview Done">Interview Done</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="d-flex justify-content-end">
                        <CheckApplicationFormModal requestDetails={requestDetails[0]}/>
                        <button type="button" className="btn btn-lg ms-3" onClick={handleCheckPictures} >Check Pictures</button>
                        <button type="button" className="btn btn-lg ms-3" onClick={handleStatusUpdate}>Update Status</button>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div>
          <div className="modal-backdrop show"></div>
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Adoption Status</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {modalMessage}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      


    </>
  );
}

export default CheckRequestPage;

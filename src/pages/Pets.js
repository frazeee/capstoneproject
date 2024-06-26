import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../components/client";
import "./Pets.css";
import Footer from "../components/Footer";
import moment from "moment";

function Pets({ user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const { data, error } = await supabase.from("Pets").select("*");
      if (error) {
        console.log("Error getting data:", error.message);
        setLoading(false);
      } else {
        const sortedData = data.slice().sort((a, b) => a.id - b.id);
        setData(sortedData);
        setLoading(false);
      }
    }
    getData();
  }, []);

  const [activeButton, setActiveButton] = useState("All");
  const [activeAge, setActiveAge] = useState("");
  const [activeShelter, setActiveShelter] = useState("");
  const [activeGender, setActiveGender] = useState("");

  const handleButtonClick = (buttonText) => {
    setActiveButton(buttonText);
  };

  const handleGenderChange = (selectedGender) => {
    setActiveGender(selectedGender);
  };

  const handleAgeChange = (selectedAge) => {
    setActiveAge(selectedAge);
  };

  const handleShelterChange = (selectedShelter) => {
    setActiveShelter(selectedShelter);
  };

  const uniqueAges = Array.from(
    new Set(data.map((cardItem) => cardItem.age))
  ).sort((a, b) => a - b);
  const uniqueShelters = Array.from(
    new Set(data.map((cardItem) => cardItem.Shelter))
  );

  const filteredCardItems = data.filter((cardItem) => {
    if (cardItem.is_adopted) {
      return false;
    }
    if (
      activeButton === "All" &&
      (!activeGender || cardItem.gender === activeGender) &&
      (!activeAge || cardItem.age.toString() === activeAge) &&
      (!activeShelter || cardItem.Shelter.toString() === activeShelter)
    ) {
      return true;
    }

    if (
      activeButton === "Cats" &&
      cardItem.pet_type === "Cat" &&
      (!activeGender || cardItem.gender === activeGender) &&
      (!activeAge || cardItem.age.toString() === activeAge) &&
      (!activeShelter || cardItem.Shelter.toString() === activeShelter)
    ) {
      return true;
    }

    if (
      activeButton === "Dogs" &&
      cardItem.pet_type === "Dog" &&
      (!activeGender || cardItem.gender === activeGender) &&
      (!activeAge || cardItem.age.toString() === activeAge) &&
      (!activeShelter || cardItem.Shelter.toString() === activeShelter)
    ) {
      return true;
    }

    return false;
  });

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <>
      <Navbar />

      <div className="bg-dark hero text-secondary px-4 py-5 text-center shadow-sm">
        <div className="py-5">
          <h1 className="display-5 fw-bold text-white">
            Every Pet Deserves a Loving Home.
          </h1>
          <h1 className="display-5 fw-bold text-white">Adopt a Pet Today!</h1>
          <div className="col-lg-6 mx-auto">
            <p className="fs-6 text-light mb-4">
              Browse our available animals and learn more about the adoption
              process. Together, we can rescue, rehabilitate, and rehome pets in
              need. Thank you for supporting our mission to bring joy to
              families through pet adoption.
            </p>
          </div>
        </div>
      </div>

      <div className="container pt-4 px-3">
        <div className="row">
          <div className="col-12">
            <h1 className="highlight-word">Adopt a Shelter cat or dog</h1>
            <hr className="w-100 mb-3" />
            <p className="fs-6">
              Our adoptable cats and dogs are all spayed/neutered and
              vaccinated. They’ve lived a difficult life before being in the
              shelters and we need to make sure that they get adopted by loving
              humans and won’t be subjected to further cruelty or neglect.
              Here’s how to apply:
            </p>
            <ul className="">
              <li>Submit the adoption application form</li>
              <li>Attend the online interview</li>
              <li>Meet our shelter animals in person</li>
              <li>Visit your chosen pet to confirm your choice</li>
              <li>Wait for vet clearance and schedule pick up</li>
              <li>Pay the adoption fee (Varying per shelter)</li>
              <li>Take your pet home!</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-fluid pt-3 padding-bottom-mobile">
        {/* First row with buttons */}
        <div className="d-flex justify-content-center align-items-center pb-3 filter-buttons">
          <button
            className={`btn ${activeButton === "All" ? "active" : ""} mx-3`}
            onClick={() => handleButtonClick("All")}
          >
            All
          </button>
          <button
            className={`btn ${activeButton === "Cats" ? "active" : ""}  mx-3`}
            onClick={() => handleButtonClick("Cats")}
          >
            Cats
          </button>
          <button
            className={`btn ${activeButton === "Dogs" ? "active" : ""}  mx-3`}
            onClick={() => handleButtonClick("Dogs")}
          >
            Dogs
          </button>
        </div>

        {/* Second row with dropdown lists */}
        <div className="row mb-3 justify-content-center">
          <div className="col-lg-4 mb-1">
            <div className="form-floating w-100">
              <select
                className="form-select"
                id="genderSelect"
                value={activeGender}
                onChange={(event) => handleGenderChange(event.target.value)}
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label htmlFor="genderSelect">Gender</label>
            </div>
          </div>

          <div className="col-lg-4 mb-1">
            <div className="form-floating w-100">
              <select
                className="form-select"
                value={activeAge}
                onChange={(event) => handleAgeChange(event.target.value)}
              >
                <option value="">All Ages</option>
                {uniqueAges.map((age) => (
                  <option key={age} value={age.toString()}>
                    {`${age} ${age === 1 ? "year" : "years"} old`}
                  </option>
                ))}
              </select>
              <label htmlFor="ageSelect">Age</label>
            </div>
          </div>

          <div className="col-lg-4 mb-1">
            <div className="form-floating w-100">
              <select
                className="form-select"
                value={activeShelter}
                onChange={(event) => handleShelterChange(event.target.value)}
              >
                <option value="">All Shelters</option>
                {uniqueShelters.map((shelter) => (
                  <option key={shelter} value={shelter}>
                    {shelter}
                  </option>
                ))}
              </select>
              <label htmlFor="shelterSelect">Shelter</label>
            </div>
          </div>
        </div>

        <hr className=" mt-0 mb-3" />

        <div className="row" key={`row`}>
          {filteredCardItems.map((cardItem) => (
            <div
              key={cardItem.id}
              className="container col-xl-3 col-lg-6 col-md-6 col-sm-12 pb-4 d-flex flex-column justify-content-center align-items-center"
            >
              <Link
                to={`/petPage/${cardItem.id}`}
                className="text-decoration-none"
              >
                <div className="card shadow on-hover">
                  <div className="card-image-top">
                    <img src={cardItem.image_url1} alt={cardItem.pet_name} />
                  </div>
                  <div className="card-title pt-3 text-center card-design">
                    <h2>{cardItem.pet_name}</h2>
                  </div>
                  <div className="card-body">
                    <div className="d-flex">
                      Age:{" "}
                      {moment().diff(moment(cardItem.birthdate), "months") <= 1
                        ? "1 month"
                        : moment().diff(moment(cardItem.birthdate), "months") <
                          12
                        ? `${moment().diff(
                            moment(cardItem.birthdate),
                            "months"
                          )} months`
                        : moment(cardItem.birthdate).fromNow(true)}{" "}
                      old
                      <span className="ms-auto">
                        {cardItem.gender === "Male" ? (
                          <i className="bi bi-gender-male"></i>
                        ) : (
                          <i className="bi bi-gender-female"></i>
                        )}
                      </span>
                    </div>
                    <p>
                      <strong>Personality:</strong> {cardItem.pet_personality}
                    </p>
                    <p>
                      <strong>Shelter:</strong> {cardItem.Shelter}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Pets;

import carterImg from "../images/carter.jpg";
import davidImg from "../images/david.jpg";
import eliezerImg from "../images/eliezer.jpg";
import emmanuelImg from "../images/emmanuel.jpg";

export default function AboutPage() {
  const members = [
    {
      name: "David Durosinmi",
      major: "Computer Engineering",
      bio: "David Durosinmi is a 20-year-old graduating Computer Engineering student. David’s career goals are to work for a large company such as AMD, NVIDIA, or Intel. Research and development keep David focused and interested in pursuing his dreams in computer development. His experience in software and web design was pivotal to the development of the SABRE smart breaker.",
      img: davidImg,
    },
    {
      name: "Carter Harman",
      major: "Computer Engineer",
      bio: "Carter Harman is a 22-year-old Computer Engineering student. Carter has taken a position with Advanced Micro Devices (AMD) as a Design Verification Engineer specializing in Verilog verification processes. Carter’s experience in software and hardware development was the heart behind the circuitry, the firmware within the ESP32, and the backend of the SABRE smart breaker website.",
      img: carterImg,
    },
    {
      name: "Eliezer Urdaneta",
      major: "Electrical Engineering",
      bio: "Eliezer Urdaneta is a 23-year-old graduating Electrical Engineering student in the power and renewable energy track. Eliezer is seeking a career focused on substation protections and controls, working for a company such as HDR, KUA or OUC.",
      img: eliezerImg,
    },
    {
      name: "Emmanuel Lopez",
      major: "Electrical Engineering",
      bio: "Emmanuel Lopez is a 23-year-old Electrical Engineering student. Emmanuel has taken a position with Quanta Infrastructure Solutions Group (QISG) as a Design Engineer specializing in substation design. Emmanuels experience in Computer-Aided Design (CAD) and hardware",
      img: emmanuelImg,
    },
  ];
  
  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h2 style={{display:'flex', justifyContent: 'center', margin: 0}}>About Us</h2>
      <p style={{ color: "#666", marginBottom: "1rem", marginTop: 0, display:'flex', justifyContent: 'center'}}>Meet the team.</p>

      {members.map((member, index) => (
        <div
          key={member.name}
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            padding: "1.25rem",
            marginBottom: "1.25rem",
            overflow: "hidden",
          }}
        >
          <img
            src={member.img}
            alt={member.name}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "8px",
              objectFit: "cover",
              float: index % 2 === 0 ? "left" : "right",
              margin: index % 2 === 0 ? "0 1.25rem 0.5rem 0" : "0 0 0.5rem 1.25rem",
            }}
          />
          <h3 style={{ margin: "0 0 4px" }}>{member.name}</h3>
          <p style={{ margin: "0 0 10px", color: "#888", fontSize: "13px" }}>{member.major}</p>
          <p style={{ margin: 0, lineHeight: 1.7, fontSize: "14px", color: "#555" }}>{member.bio}</p>
          <div style={{ clear: "both"}} />
        </div>
      ))}

      <hr style={{ border: "none", borderTop: "1px solid #e5e5e5", margin: "2.5rem 0"}} />

      <section>
        <h3 style={{display: "flex", justifyContent: "center"}}>Acknowledgements</h3>
        <p style={{ lineHeight: 1.8, fontSize: "14px", color: "#555"}}>
          We would like to acknowledge the assistance and support of Dr. Qun Zhou Sun, Professor Saleem Sahawneh, and Dr. Arthur Weeks.
        </p>
      </section>
    </div>
  );
}

import SectionTitle from "../components/SectionTitle";

function Education() {
  return (
    <section className="education-section section-grid" id="education">
      <SectionTitle number="06">EDUCATION</SectionTitle>
      <div className="education-content">
        <h2>
          ETEC CENTER
          <br />
          <span>IT Instructor.</span>
        </h2>
        <p>
          Teaching and mentoring students in programming, web development, and basic C/C++ logic algorithms.
           I provide guidance on coding best practices, project development, and career growth in the IT industry.
        </p>
      </div>
    </section>
  );
}

export default Education;

import SectionTitle from "../components/SectionTitle";
import { experience } from "../data/experience";

function Experience() {
  return (
    <section className="experience-section section-grid" id="experience">
      <SectionTitle number="05">EXPERIENCE</SectionTitle>
      <div className="experience-content">
        <h2>
          <span className="experience-lead"><i><u>Learning by doing</u></i></span>
          
        </h2>
        <div className="experience-list">
          {experience.map((item) => (
            <article className="experience-item" key={item.title}>
              <span>{item.period}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;

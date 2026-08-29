import SectionTitle from "../components/SectionTitle";
import { projects } from "../data/projects";
import "./Projects.css";

function Projects() {
  return <section className="projects-section section-grid" id="projects"><SectionTitle>SELECTED PROJECTS</SectionTitle><div className="projects-content"><div className="projects-heading-row"><h2>Ideas into<br /><span>interfaces.</span></h2><p>PROJECTS 2026</p></div><div className="project-list">{projects.map((project) => <a className="project-item" href={project.href} key={project.title} target="_blank" rel="noreferrer"><div className="project-preview"><img src={project.image} alt={`${project.title} preview`} loading="lazy" /><span>LIVE PREVIEW</span></div><div className="project-details"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p className="project-url">{project.href.replace("https://", "").replace(/\/$/, "")}</p><p>{project.description}</p><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><span className="project-arrow">↗</span></a>)}</div></div></section>;
}

export default Projects;

import "./CompanyMarquee.css";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Adobe",
  "Uber",
  "Spotify",
  "Airbnb",
];

const CompanyMarquee = () => {
  return (
    <div className="marquee-section">
     

      <div className="marquee">
        <div className="marquee-track">
          {companies.concat(companies).map((company, index) => (
            <span key={index} className="marquee-item">
              {company}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyMarquee;

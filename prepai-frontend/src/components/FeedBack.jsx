import "./FeedBack.css";
 
const testimonials = [
  {
    name: "Casey O'Brien",
    role: "Solutions Consulting Director",
    text:
      "PrepAI has completely transformed my interview preparation. Gone are the days of guessing what companies ask.",
  },
  {
    name: "Jon Lo",
    role: "Co-founder & CEO",
    text:
      "It's so good. I've recommended PrepAI to so many people and use it daily.",
  },
  {
    name: "Daniela De Almada",
    role: "Head of Marketing",
    text:
      "We absolutely love PrepAI. We use it for preparing real-world interview scenarios.",
  },
  {
    name: "Stefan Alexiev",
    role: "Co-founder & CEO",
    text:
      "PrepAI is a no-brainer for anyone serious about cracking interviews quickly.",
  },
  {
    name: "Leonard Korkmaz",
    role: "Product Marketing Manager",
    text:
      "Simple to use yet powerful enough to simulate real company interviews.",
  },
  {
    name: "Lucien Lu",
    role: "Digital Marketer",
    text:
      "Way better than random interview prep. PrepAI feels 10x more realistic.",
  },


 
  {
    name: "Aarav Mehta",
    role: "Final Year CS Student",
   
    text:
      "PrepAI helped me understand how real interviews feel. The questions were practical and the feedback showed exactly where I was going wrong."
  },
  {
    name: "Priya Sharma",
    role: "Frontend Developer",
    
    text:
      "I was nervous before interviews, but PrepAI gave me confidence. The AI feedback felt like a real interviewer pointing out my weak spots."
  },
  {
    name: "Rohan Verma",
    role: "Backend Developer",
   
    text:
      "The role-based questions are extremely useful. Much better than random interview prep videos. I could clearly track my progress."
  },
  {
    name: "Neha Kapoor",
    role: "Data Science Aspirant",
    
    text:
      "PrepAI helped me practice structured answers. The summary and strengths section after the interview was incredibly helpful."
  },
  {
    name: "Aditya Singh",
    role: "Software Engineer",
    
    text:
      "The interview flow feels natural. PrepAI is now part of my regular preparation before switching jobs."
  },
  {
    name: "Kunal Patel",
    role: "React Developer",
    
    text:
      "Way better than practicing alone. PrepAI highlights mistakes I never noticed while self-practicing."
  },
  


];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <h2 className="testimonials-title">
        Straight from the people who <br /> use PrepAI the most
      </h2>

      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-header">
              <img   src={`https://ui-avatars.com/api/?background=0D8ABC&name=${t.name}`}
alt={t.name} />
              <div>
                <h4>{t.name}</h4>
                <span>{t.role}</span>
              </div>
            </div>

            <p className="testimonial-text">“{t.text}”</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

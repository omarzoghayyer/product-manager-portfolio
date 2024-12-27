import React from "react";

import "./style/ProfilePictureAndName.css";
import "./style/ProfessionalSummaryStyle.css";

function Summary() {
  return (
    <div>
   
        <div className="professional-summary">
          <div className="professional-summary-box">
            <p className="paragraph-box">
              <spam className='tpmSummary'>Technical Product Manager </spam>with extensive product ownership experience in gaming and tech. Record
              of delivering strong results by collaborating, applying data to
              address issues, and fostering innovation. Unintimidated by new
              ideas. Excels in leading teams. 
            </p>
            <span> Below are some of the recent products I worked on: </span>
          </div>
      </div>
    </div>
  );
}

export default Summary;

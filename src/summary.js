import React from "react";

import "./style/ProfilePictureAndName.css";
import "./style/ProfessionalSummaryStyle.css";

function Summary() {
  return (
    <div>
   
        <div className="professional-summary">
          <div className="professional-summary-box">
            <p className="paragraph-box">
              <spam className='tpmSummary'>I'm a Technical Product Manager</spam> with a background in product ownership across the tech and gaming sectors.  I have over five years of experience in both development and product management. I enjoy tackling complex challenges and am particularly focused on improving device performance. My areas of interest include Mobile Development, AI and Cloud Security.
            </p>
            <span> Below are some of the recent products I worked on: </span>
          </div>
      </div>
    </div>
  );
}

export default Summary;

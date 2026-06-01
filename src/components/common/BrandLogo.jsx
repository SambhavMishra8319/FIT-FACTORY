import "../../styles/BrandLogo.css"

export default function BrandLogo({ small = false }) {
  return (
    <div className={`brand-logo-wrap ${small ? "small" : ""}`}>
      <div className="brand-logo-icon">
        F2
      </div>

      <div className="brand-logo-content">
        <div className="brand-logo-name">
          FIT FACTORY
        </div>

        <div className="brand-logo-owner">
          by Nimesh Mishra
        </div>
      </div>
    </div>
  );
}
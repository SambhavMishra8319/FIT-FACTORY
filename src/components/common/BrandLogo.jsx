export default function BrandLogo({ small = false }) {
  return (
    <div className="logo-brand">
      <div
        className="logo-f2"
        style={{
          fontSize: small ? 18 : 24,
        }}
      >
        F2 FIT
        <br />
        FACTORY
      </div>

      <div className="logo-owner">
        by Nimesh Mishra
      </div>
    </div>
  );
}
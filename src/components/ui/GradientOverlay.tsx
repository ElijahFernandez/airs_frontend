const GradientOverlay = ({ className = "" }) => {
    return (
      <div
        className={`absolute inset-0 pointer-events-none flex-col items-center justify-center 
        bg-black dark:bg-black-100 
        [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] ${className}`}
      />
    );
  };
  
  export default GradientOverlay;
  
const NoRecord = ({ title }) => (
  <div className="relative mx-20 text-center font-exo text-2xl  z-10">
    {title && <h5>{title}</h5>}
    <div className="absolute top-32 left-0 right-0">
    Nothing found
    <div className=" absolute animate-ping text-8xl -top-12 left-0 right-0 z-0">⚠️</div>
    </div>
  </div>
);

export default NoRecord;

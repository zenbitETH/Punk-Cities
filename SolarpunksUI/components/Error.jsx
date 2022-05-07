import util from "util";
import { prettyLog } from "../lib/prettyLog";

const ErrorComponent = ({ error }) => {
  if (error) prettyLog("Error", util.format("%j", error), false, true);

  return (
    <div>
      <h6>Oops, something bad happens.</h6>
    </div>
  );
};

export default ErrorComponent;

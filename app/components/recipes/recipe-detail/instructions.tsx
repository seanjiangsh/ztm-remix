import { Fragment } from "react";
import classNames from "classnames";

import ErrorMessage from "~/components/form/error-message";

type InstructionsProps = {
  id: string;
  instructions: string;
  errors?: { instructions: string };
};
export default function Instructions(props: InstructionsProps) {
  const { id, instructions, errors } = props;
  const { instructions: instructionsError } = errors || {};

  return (
    <Fragment>
      <label
        key={`${id}_instructions_label`} // * key is required to override the default behavior of React Form status persistence
        htmlFor="instructions"
        className="block font-bold text-sm pb-2 w-fit"
      >
        Instructions
      </label>
      <textarea
        key={`${id}_instructions_textarea`} // * key is required to override the default behavior of React Form status persistence
        id="instructions"
        name="instructions"
        placeholder="Instructions go here"
        className={classNames(
          "w-full h-56 rounded-md outline-none",
          "focus:border-2 focus:p-3 focus:border-primary duration-300",
          !!instructionsError && "border-2 border-red-500 p-3"
        )}
        defaultValue={instructions || ""}
      />
      <ErrorMessage>{instructionsError}</ErrorMessage>
    </Fragment>
  );
}

import Datepicker from "tailwind-datepicker-react";
import { useState, useEffect, useRef } from "react";
import { stringify } from "querystring";
import { TextInput } from "flowbite-react";

const options = {
  autoHide: true,
  clearBtn: true,
  //   maxDate: new Date(),
  //   minDate: new Date("1950-01-01"),
  language: "en",
  datepickerClassNames: "top-12",
};

export default function DatePicker({ onChange, value }: { onChange: (selectedDate: Date) => void; value: Date }) {
  const [show, setShow] = useState<boolean>(false);
  const handleClose = (state: boolean) => {
    setShow(state);
  };

  return (
    <div>
      <Datepicker options={options} onChange={onChange} show={show} setShow={handleClose}>
        <TextInput type="text" className="..." placeholder="Select Date" value={value.toDateString()} onFocus={() => setShow(true)} readOnly />
      </Datepicker>
    </div>
  );
}

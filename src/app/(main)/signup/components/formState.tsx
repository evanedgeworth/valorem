import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

interface IFormContext {
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
  onHandleBack: () => void;
  onHandleNext: () => void;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const FormContext = createContext<IFormContext>({
  formData: { accountType: "client" },
  onHandleBack: () => {},
  onHandleNext: () => {},
  setFormData: () => {},
  step: 1,
  setStep: () => {},
});

interface IProps {
  children: ReactNode;
}

export function FormProvider({ children }: IProps) {
  const [formData, setFormData] = useState();
  const [step, setStep] = useState(1);

  function onHandleNext() {
    setStep((prev) => prev + 1);
  }

  function onHandleBack() {
    setStep((prev) => prev - 1);
  }

  return <FormContext.Provider value={{ formData, setFormData, onHandleBack, onHandleNext, step, setStep }}>{children}</FormContext.Provider>;
}

export function useFormState() {
  return useContext(FormContext);
}

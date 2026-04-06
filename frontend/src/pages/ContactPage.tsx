import { useState } from "react";

interface FormData {
  firstName: string;
  lastNmae: string;
  email: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  };

  const [errors, setErrors] = useState<formErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    
    
  return (
    <div>
      <h2>Contact Us</h2>
      {/*design a contact page*/}
    </div>
  );
}

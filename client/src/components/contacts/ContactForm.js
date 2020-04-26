import React, { useState, useContext, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";
import AlertContext from "../../context/alert/alertContext";

const ContactForm = () => {
  const contactContext = useContext(ContactContext);
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const {
    addContact,
    currentContact,
    updateContact,
    clearCurrent,
    clearErrors,
    error,
  } = contactContext;

  useEffect(() => {
    if (error) {
      setAlert(error, "danger");
      clearErrors();
    }

    if (currentContact !== null) {
      setContact(currentContact);
    } else {
      setContact({ name: "", email: "", phone: "", type: "personal" });
    }
    // eslint-disable-next-line
  }, [currentContact, contactContext, error]);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    type: "personal",
  });
  const { name, email, phone, type } = contact;
  const onChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (currentContact === null) {
      addContact(contact);
    } else {
      updateContact(contact);
      clearCurrent();
    }
    setContact({ name: "", email: "", phone: "", type: "personal" });
  };

  const clearAll = (e) => {
    clearCurrent();
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className='primery'>
        {currentContact ? "Edit Contact" : "Add Contact"}
      </h2>
      <input
        type='text'
        name='name'
        value={name}
        placeholder='Name'
        onChange={onChange}
      />
      <input
        type='email'
        name='email'
        value={email}
        placeholder='Email'
        onChange={onChange}
      />
      <input
        type='text'
        name='phone'
        value={phone}
        placeholder='Phone'
        onChange={onChange}
      />
      <h5> Contact Type</h5>
      <input
        type='radio'
        name='type'
        value='personal'
        onChange={onChange}
        checked={type === "personal"}
      />
      Personal{" "}
      <input
        type='radio'
        name='type'
        value='professional'
        onChange={onChange}
        checked={type === "professional"}
      />
      Professional
      <div>
        <input
          type='submit'
          className='btn btn-primary btn-block'
          value={currentContact ? "Update Contact" : "Add Contact"}
        />
      </div>
      {currentContact && (
        <div>
          <button className='btn btn-light btn-block' onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactForm;

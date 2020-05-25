import React, { useState, useEffect } from 'react';
const useValidate = (initialState, validate, submit) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [submitForm, setSubmitForm] = useState(false);
    useEffect(() => {
        if(submitForm) {
            const noErrors = Object.keys(errors).length === 0;
            if(noErrors) {
                submit();
            }
            setSubmitForm(false);
        }
    }, [errors])
    const handleOnChange = ev => {
        setValues({
            ...values,
            [ev.target.name]: ev.target.value
        })
    }
    const handleSubmit = ev => {
        ev.preventDefault();
        const errorValidate = validate(values);
        setErrors(errorValidate);
        setSubmitForm(true);
    }

    const handleOnBlur = () => {
        const errorValidate = validate(values);
        setErrors(errorValidate);
    }
    return {
        values,
        errors,
        handleOnChange,
        handleSubmit,
        handleOnBlur
    }
}
 
export default useValidate;
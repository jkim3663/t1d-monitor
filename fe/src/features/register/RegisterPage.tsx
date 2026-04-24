import { useState } from 'react';
import styles from './RegisterPage.module.scss';
import { validateEmail } from '../../utils/util';
import { useMutation } from '@tanstack/react-query';
import { postRegistration } from '../../apis/authorization';
import { replace, useNavigate } from 'react-router-dom';

type InputType = {
    value: 'email' | 'password'
}

 function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationKey: ['register'],
        mutationFn: postRegistration,
        onSuccess: (data) => {
            if (data.status === 200) {
                console.log('successful registration');
                navigate('/login', { replace: true });
            } else {
                setErrMsg(JSON.stringify(data.data));
            }
        },
        onError: (error) => {
            console.error('registration error: ', error);
            setErrMsg('Registration failed for unknown error');
        }
    });
    
    function handleChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, inputType: InputType) {
        if (inputType.value === 'email') {
            setEmail(event.target.value);
        } else {
            setPassword(event.target.value);
        }
    }

    function handleRegisterClick() {
        if (email.length === 0 || password.length === 0) {
            setErrMsg('Email and password cannot be empty');
            return;
        } else if (validateEmail(email) == null) {
            setErrMsg('Email should be in a valid format');
            return;
        }
        mutation.mutate({
            email,
            password
        });
    }

    return (
        <div className={styles.registerPageContainer}>
            <div>
                Email
            </div>
            <input 
                className={styles.loginInput}
                placeholder='Enter email:' 
                value={email}
                onChange={(e) => handleChange(e, {value: 'email'})}
            />
            <div>
                Password
            </div>
            <input
                className={styles.loginInput}
                placeholder='Enter password:' 
                value={password}
                onChange={(e) => handleChange(e, {value: 'password'})}
            />
            <button 
                className={styles.signInButton}
                onClick={handleRegisterClick}
            >
                Register
            </button>
            {
                errMsg  && 
                <div className={styles.errorMessage}>
                    { errMsg }
                </div>
            }
        </div>
    )
}

export default RegisterPage;
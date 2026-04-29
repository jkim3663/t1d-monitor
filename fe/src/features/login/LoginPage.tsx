import { useState } from 'react';
import styles from './LoginPage.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLogin } from '../../apis/authorization';

type InputType = {
    value: 'email' | 'password'
}

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ['login'],
        mutationFn: postLogin,
        onSuccess: (data) => {
            if (data.status === 200) {
                queryClient.setQueryData(['session'], { statusCode: 200 });
                navigate('/home', { replace: true });
            } else {
                setErrMsg(JSON.stringify(data.data));
            }
        },
        onError: (error) => {
            console.error('unknown error during login:', error);
            setErrMsg('unknown error during login');
        }
    });

    function handleChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, inputType: InputType) {
        if (inputType.value === 'email') {
            setEmail(event.target.value);
        } else {
            setPassword(event.target.value);
        }
    }

    function handleLoginClick() {
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
        <div className={styles.loginPageContainer}>
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
                onClick={handleLoginClick}
            >
                Sign in
            </button>
            {
                errMsg  && 
                <div className={styles.errorMessage}>
                    { errMsg }
                </div>
            }
            <div>
                <p>
                    New User?
                </p>
                <Link to='/register'>
                    Register here
                </Link>
            </div>
        </div>
    )
}

export default LoginPage;
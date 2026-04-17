import { useState } from 'react';
import styles from './LoginPage.module.scss';

type InputType = {
    value: 'email' | 'password'
}

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, inputType: InputType) {
        if (inputType.value === 'email') {
            setEmail(event.target.value);
        } else {
            setPassword(event.target.value);
        }
    }

    return (
        <div className={styles.loginPageContainer}>
            <div>Email</div>
            <input 
                placeholder='Enter email:' 
                value={email}
                onChange={(e) => handleChange(e, {value: 'email'})}
            />
            <div>Password</div>
            <input 
                placeholder='Enter password:' 
                value={password}
                onChange={(e) => handleChange(e, {value: 'password'})}
            />
            <button>Sign in</button>
        </div>
    )
}

export default LoginPage;
import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Por favor ingrese un nombre.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor ingrese un email valido.');
      return;
    }

    if (!password) {
      setError('Por favor ingrese una contraseña.');
      return;
    }

    setError('')

    //Registro y llamado de la api
    
    try {
      const response = await axiosInstance.post('/create-account', {
        fullName: name,
        email: email,
        password: password,
      });
      
      //Respuesta de registro
      if(response.data && response.data.error) {
        setError(response.data.error);
        return
      }

      if(response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (error) {
      //Error en login
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError ('Se produjo un error inesperado. Por favor inténtalo de nuevo.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center' style={{ backgroundColor: '#f7f7ff', minHeight: '100vh' }}>
        <div className='w-96 border rounded-lg bg-white px-7 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7'>Registrate</h4>
            <input 
              type="text" 
              placeholder='Nombre' 
              className='input-box'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input 
              type="text" 
              placeholder='Correo' 
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type="submit" className='btn-primary rounded-lg'>
            Crear una cuenta
            </button>
            <p className='text-sm text-center mt-4'>
            ¿Ya tienes una cuenta?{' '}
              <Link to='/login' className='font-medium text-primary underline'>
                Iniciar Sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;

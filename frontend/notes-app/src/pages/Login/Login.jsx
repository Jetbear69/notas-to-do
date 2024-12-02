import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Por favor ingrese un email valido.');
      return;
    }

    if (!password) {
      setError('Por favor ingrese una contraseña.');
      return;
    }

    setError('')

    //Logueo y llamado de la api

    try {
      const response = await axiosInstance.post('https://notas-to-do-eta.vercel.app', {
        email: email,
        password: password,
      });
      
      //Respuesta de login
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
        <form onSubmit={handleLogin}>
          <h4 className='text-2xl mb-7'>Logueate</h4>
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
          Iniciar Sesión
          </button>
          <p className='text-sm text-center mt-4'>
          ¿Aún no estás registrado?{' '}
            <Link to='/signup' className='font-medium text-primary underline'>
            Crear una cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  </>
  );
}

export default Login;

import React from 'react';
import { MdClose } from 'react-icons/md';

const DeleteNotes = ({ noteTitle, onDelete, onClose }) => {
    return (
        <div className='relative'>
            <button
                className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50'
                onClick={onClose}
            >
                <MdClose className='text-xl text-slate-400' />
            </button>
            <div className='flex flex-col gap-2 items-center justify-center'>
                <p className='text-sm text-slate-700'>¿Estás seguro de que deseas eliminar la nota "{noteTitle}"?</p>
                <div className='flex justify-end gap-2'>
                    <button 
                        className='btn-primary font-medium mt-5 p-3 text-base h-10 justify-center items-center flex' 
                        onClick={onDelete}
                    >
                        Sí
                    </button>
                    <button 
                        className='btn-secondary font-medium mt-5 p-3 text-base h-10 justify-center items-center flex' 
                        onClick={onClose}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteNotes;

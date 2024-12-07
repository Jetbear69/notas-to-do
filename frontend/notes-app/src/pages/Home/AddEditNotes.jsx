import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
    const [title, setTitle] = useState(noteData?.title || '');
    const [content, setContent] = useState(noteData?.content || '');
    const [tags, setTags] = useState(noteData?.tags || []);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(noteData?.status || 'Pending');
    const toggleStatus = () => {
        setStatus((prevStatus) => (prevStatus === 'Pending' ? 'Completed' : 'Pending'));
    };
    // Agregar notas
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post('/add-note', {
                title,
                content,
                tags,
            });

            if (response.data && response.data.note) {
                showToastMessage('Nota agregada exitosamente')
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            }
        }
    };

    // Editar notas
    const editNote = async () => {
        const noteId = noteData._id

        try {
            const response = await axiosInstance.put('/edit-note/' + noteId, {
                title,
                content,
                tags,
            });

            if (response.data && response.data.note) {
                showToastMessage('Nota actualizada exitosamente')
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            }
        }
    };

    const handleAddNote = () => {
        if (!title) {
            setError('Por favor, ingrese un título');
            return;
        };

        if (!content) {
            setError('Por favor, ingrese contenido');
            return;
        };

        setError('');

        if (type === 'edit') {
            editNote()
        } else {
            addNewNote()
        };

    };

    return (
        <div className='relative'>
            <button
                className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50'
                onClick={onClose}
            >
                <MdClose className='text-xl text-slate-400' />
            </button>
            <div className='flex flex-col gap-2'>
                <label className='input-label'>Título</label>
                <input
                    type='text'
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='Ir al Gimnasio a las 5:00 AM'
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>

            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>Contenido</label>
                <textarea
                    type='text'
                    className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                    placeholder='Escribe aquí tu nota'
                    rows={10}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                />
            </div>

            <div className='mt-3'>
                <label className='input-label'>Tags</label>
                <TagInput 
                    tags={tags} 
                    setTags={setTags}
                />
            </div>

            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

            <button 
                className='btn-primary font-medium mt-5 p-3 rounded-lg' 
                onClick={handleAddNote}
            >
                {type === 'edit' ? 'ACTUALIZAR' : 'CREAR NOTA'}
            </button>
        </div>
    );
};

export default AddEditNotes;
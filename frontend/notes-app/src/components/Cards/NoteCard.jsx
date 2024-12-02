import moment from 'moment';
import React from 'react';
import { MdOutlinePushPin } from 'react-icons/md';
import { MdCreate, MdDelete } from 'react-icons/md';
import { FaRegClock } from 'react-icons/fa';
import { LuCheck } from 'react-icons/lu';

const NoteCard = ({ title,
    date,
    content,
    tags,
    isPinned,
    status,
    onEdit,
    onDelete,
    onPinNote,
    updateNoteStatus,
    noteData,
}) => {
    return (
        <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
            <div className='flex items-center justify-between'>
                <div>
                    <h6 className='text-sm font-medium'>{title}</h6>
                    <span className='text-xs text-slate-500'>{moment(date).format('Do MMMM YYYY')}</span>

                </div>

                <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} title="Fijar" />
            </div>

            <p className='text-xs text-slate-600 mt-2'>{content?.slice(0, 60)}</p>

            <div className='flex items-center justify-between mt-2'>
                <div className='text-xs text-slate-500'>{tags.map((item)=> `#${item} `)}</div>

                <div className='flex items-center gap-2'>
                    <FaRegClock 
                        className={`icon-btn ${status === 'pending' ? 'text-orange-500' : 'text-slate-300'} hover:text-orange-500`} 
                        onClick={() => updateNoteStatus(noteData, status === 'pending' ? 'none' : 'pending')} 
                        title="Pendiente" 
                    />
                    <LuCheck 
                        className={`icon-btn ${status === 'completed' ? 'text-green-500' : 'text-slate-300'} hover:text-green-500`} 
                        onClick={() => updateNoteStatus(noteData, status === 'completed' ? 'none' : 'completed')} 
                        title="Completado" 
                    />
                    <MdCreate
                        className='icon-btn hover:text-fuchsia-500'
                        onClick={onEdit}
                        title="Editar"
                    />
                    <MdDelete
                        className='icon-btn hover:text-red-500'
                        onClick={onDelete}
                        title="Eliminar"
                    />
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
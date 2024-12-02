import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from '../../assets/images/agregar-nota.svg';
import NoDataImg from '../../assets/images/no-encontrado.svg';
import DeleteNotes from './DeleteNotes';

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: '',
    type: 'add',
  });

  const [allNotes, setAllNotes] = useState([])
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: 'edit' });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: '',
    });
  };

  // Tomar información del usuario
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  // Tomar las notas
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes');

      if (response.data && response.data.notes) {
        const sortedNotes = response.data.notes.sort((a, b) => {
          if (a.isPinned === b.isPinned) {
            return new Date(b.createdOn) - new Date(a.createdOn); 
          }
          return a.isPinned ? -1 : 1; 
        });
        setAllNotes(sortedNotes); 
      }
    } catch (error) {
      console.log('Se produjo un error inesperado. Por favor inténtalo de nuevo.');
    }
  };

  // Eliminar notas

  const deleteNote = async (data) => {
    const noteId = data._id
    try {
      const response = await axiosInstance.delete('/delete-note/' + noteId);

      if (response.data && !response.data.error) {
        showToastMessage('Nota eliminada exitosamente', 'delete')
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log('Se produjo un error inesperado. Por favor inténtalo de nuevo.');
      }
    }
  };

  // Buscar notas
  const onSearchNote = async (query, status) => {
    try {
      const response = await axiosInstance.get('/search-notes', {
        params: { query, status },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      } else {
        setAllNotes([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id

    try {
      const response = await axiosInstance.put(
        '/update-note-pinned/' + noteId, 
        {
          isPinned: !noteData.isPinned,
        }
      );

      if (response.data && response.data.note) {
        showToastMessage('Nota actualizada con éxito')
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateNoteStatus = async (noteData, newStatus) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put('/update-note-status/' + noteId, {
        status: newStatus,
      });

      if (response.data && response.data.note) {
        const message = newStatus === 'completed' 
          ? 'Marcado como completado' 
          : newStatus === 'pending' 
          ? 'Marcado como pendiente' 
          : 'Nota actualizada exitosamente';
        showToastMessage(message);
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  // Función para manejar la eliminación de notas
  const handleDeleteNote = (note) => {
    setNoteToDelete(note);
    setConfirmDelete(true);
  };

  // Función para confirmar la eliminación
  const confirmDeleteNote = async () => {
    if (noteToDelete) {
      await deleteNote(noteToDelete);
      setConfirmDelete(false);
      setNoteToDelete(null);
    }
  };

  // Función para cancelar la eliminación
  const cancelDelete = () => {
    setConfirmDelete(false);
    setNoteToDelete(null);
  };

  useEffect(() => {
    getAllNotes()
    getUserInfo();
    return () => { };
  }, []);

  return (
    <div style={{ backgroundColor: '#f7f7ff', minHeight: '100vh' }}>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className='container mx-auto'>
        {allNotes.length > 0 ? (
          <div className='grid grid-cols-3 gap-4 mt-8'>
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                status={item.status}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDeleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
                updateNoteStatus={updateNoteStatus}
                noteData={item}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddNotesImg}
            message={
              isSearch
                ? `¡Ups! No se encontraron notas que coincidan con su búsqueda.`
                : `¡Empieza a crear tu primera nota! Haga clic en el botón 'Agregar' para anotar sus 
            pensamientos, ideas y recordatorios. ¡Empecemos!`
            }
          />
        )}
      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-blue-600 absolute right-10 bottom-10' onClick={() => {
        setOpenAddEditModal({ isShown: true, type: 'add', data: null });
      }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        contentLabel=''
        className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow'
      >

        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: 'add', data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />

      {confirmDelete && (
        <Modal
          isOpen={confirmDelete}
          onRequestClose={cancelDelete}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
          contentLabel='Eliminar Nota'
          className='w-[35%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow'
        >
          <DeleteNotes
            noteTitle={noteToDelete.title}
            onDelete={confirmDeleteNote}
            onClose={cancelDelete}
          />
        </Modal>
      )}
    </div>
  );
};

export default Home;
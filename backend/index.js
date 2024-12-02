require('dotenv').config();
const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.model');
const Note = require('./models/note.model');

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');


app.use(express.json());

app.use(
    cors({
        origin:'https://notas-to-do-eta.vercel.app',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);


app.get('/', (req, res) => {
    res.json({ data: 'hello'});
});

// Backend listo!!!

// Creación de cuenta

app.post('/create-account', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res
        .status(400)
        .json({ error: true, message: 'Se requiere nombre completo' });
    }

    if (!email) {
        return res.status(400).json({ error:true, message: 'Se requiere correo electrónico' });
    }

    if (!password) {
        return res
        .status(400)
        .json({ error: true, message: 'Se requiere contraseña' });
    }

    const isUser = await User.findOne({ email:email });

    if (isUser) {
        return res.json({ 
            error: true, 
            message: 'El usuario ya existe', 
        });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '36000m',
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: 'Registro exitoso',
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Se requiere correo electrónico' });
    }

    if (!password) {
        return res.status(400).json({ message: 'Se requiere contraseña' });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '36000m',
        });

        return res.json({
            error: false,
            message: 'Inicio de sesión exitoso',
            email,
            accessToken,    
        });
    
    } else {
        return res.status(400).json({
            error: true,
            message: 'Credenciales no válidas',
        });
    }
});

// Obtener usuario

app.get('/get-user', authenticateToken, async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName, 
            email: isUser.email, 
            _id: isUser._id,
            createOn: isUser.createOn,
        },
        message: '',
    });
});

// Agregar Nota

app.post('/add-note', authenticateToken, async (req, res) => {
    const { title, content, tags, date } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: 'Se requiere título' });
    }

    if (!content) {
        return res
        .status(400)
        .json({ error: true, message: 'Se requiere contenido' });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
            date,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Nota agregada exitosamente',
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor',
        });
    }
});

// Editar Nota

app.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned, date } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: 'No se proporcionaron cambios' });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: 'Nota no encontrada' });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Nota actualizada con éxito',
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor',
        });
    }
});

// Obtener todas las notas

app.get('/get-all-notes/', authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id            
        }).sort({ Pinned: -1
        });

        return res.json({
            error: false,
            notes,
            message: 'Todas las notas recuperadas exitosamente',
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor',
        });
    }
});

// Eliminar Nota

app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: 'Nota no encontrada' });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: 'Nota eliminada exitosamente',
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor',
        });
    }
});

// Actualizar valor isPinned

app.put('/update-note-pinned/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;


    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: 'Nota no encontrada' });
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Nota actualizada con éxito',
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor',
        });
    }
});

// Actualizar valor isPending
app.put('/update-note-pending/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPending } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: 'Nota no encontrada' });
        }

        note.isPending = isPending;

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Nota actualizada con éxito',
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor',
        });
    }
});

// Actualizar valor isCompleted
app.put('/update-note-completed/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isCompleted } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: 'Nota no encontrada' });
        }

        note.isCompleted = isCompleted;

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Nota actualizada con éxito',
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor',
        });
    }
});

// Buscar Notas
app.get('/search-notes/', authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query, status } = req.query;

    if (!query && !status) {
        return res.status(400).json({ error: true, message: 'Se requiere consulta de búsqueda' });
    }

    try {
        const filter = { userId: user._id };

        if (query) {
            filter.$or = [
                { title: { $regex: new RegExp(query, 'i') } },
                { content: { $regex: new RegExp(query, 'i') } },
                { tags: { $regex: new RegExp(query, 'i') } },
                { status: { $regex: new RegExp(query, 'i') } },
            ];
        }
        const matchingNotes = await Note.find(filter);

        return res.json({
            error: false,
            notes: matchingNotes,
            message: 'Notas que coinciden con la consulta de búsqueda recuperadas exitosamente',
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor',
        });
    }
});

// Actualizar el estado de la nota
app.put('/update-note-status/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedNote = await Note.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedNote) {
            return res.status(404).json({ error: true, message: 'Nota no encontrada' });
        }

        return res.json({
            error: false,
            note: updatedNote,
            message: 'Estado de la nota actualizado exitosamente',
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor',
        });
    }
});

app.listen(3001, () => {
    console.log('Server is Running')
});

module.exports = app;

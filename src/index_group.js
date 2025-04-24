// import checkID from './middleware/checkID.js';
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import path from 'path';
import { checkID } from './middleware/checkmiddleware.js'; 
import { validateUserInput } from './middleware/checkmiddleware.js'; 
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log('Time:', new Date().toISOString());
    console.log('App-level middleware');
    next();
});

// Hàm đọc dữ liệu từ file JSON
const readUsers = () => {
    try {
        const data = fs.readFileSync(path.resolve('src/users.json'), 'utf-8', (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
        })
        console.log(data);
        
        if(!data) {
            return [];
        }
    
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Hàm ghi dữ liệu vào file JSON
const writeUsers = (users) => {
    fs.writeFileSync(path.join('src/users.json'), JSON.stringify(users, null, 2), 'utf-8');
};

// Lấy danh sách người dùng
app.get('/users', (req, res) => {
    console.log('Get users');
    res.status(200).json(readUsers());
});

// Lấy thông tin chi tiết của một người dùng
app.get('/user/:id', checkID, (req, res) => {
    const users = readUsers();
    const idUser = parseInt(req.params.id);
    const user = users.find(user => user.id === idUser);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
});
// Thêm người dùng
app.post('/users', validateUserInput,(req, res) => {
    const users = readUsers();
    const { id, name, age } = req.body;
    const newUser = { id, name, age };
    users.push(newUser);
    writeUsers(users);

    res.status(201).json(newUser);
});

// Xóa người dùng
app.delete('/users/:id', checkID, (req, res) => {
    let users = readUsers();
    const idUser = parseInt(req.params.id);
    const updatedUsers = users.filter(user => user.id !== idUser);

    if (updatedUsers.length === users.length) {
        return res.status(404).json({ error: "User not found" });
    }

    writeUsers(updatedUsers);
    res.status(204).send(); 
});

app.put('/users/:id', validateUserInput, (req, res) => {
    let users = readUsers();
    const idUser = parseInt(req.params.id);
    const { name, age } = req.body;
    let userFound = false;

    users = users.map(user => {
        if (user.id === idUser) {
            userFound = true;
            return {
                ...user,
                name: name !== undefined ? name : user.name,
                age: age !== undefined ? age : user.age,
            };
        }
        return user;
    });

    if (!userFound) {
        return res.status(404).json({ error: "User not found" });
    }

    writeUsers(users);
    res.status(200).json(users.find(user => user.id === idUser));
});

// Sắp xếp danh sách người dùng
app.get('/user_sort/:choice', (req, res) => {
    let users = readUsers();
    const choice = req.params.choice;
    if (choice === "asc") {
        users.sort((a, b) => a.id - b.id);
    } else if (choice === "desc") {
        users.sort((a, b) => b.id - a.id);
    } else {
        return res.status(400).json({ error: "Invalid sorting option" });
    }

    res.status(200).json(users);
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

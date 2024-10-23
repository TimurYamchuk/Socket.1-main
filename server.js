const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8080;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const menu = [
    { item: 'Burger', price: 5 },
    { item: 'Cola', price: 2 },
    { item: 'Fries', price: 3 },
    { item: 'Nuggets', price: 4 }
];

io.on('connection', (socket) => {
    console.log('User connected to socket');

    socket.emit('menu', menu);

    socket.on('order', (data) => {
        const { item, quantity } = data;
        const selectedItem = menu.find(menuItem => menuItem.item.toLowerCase() === item.toLowerCase());

        if (selectedItem) {
            const total = selectedItem.price * quantity;
            console.log(`Client ordered ${quantity} x ${selectedItem.item} for a total of $${total}`);
            socket.emit('orderConfirmation', `You ordered ${quantity} x ${selectedItem.item}. Total: $${total.toFixed(2)}`);
        } else {
            console.log(`Order error: Item "${item}" not found`);
            socket.emit('orderError', 'Item not found in the menu.');
        }
    });
});

server.listen(port, () => {
    console.log(`App running on port ${port}`);
});

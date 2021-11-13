<h1 align="center">BIRIDERPRO Server side</h1>

<div>
Client side implemented through this backend <a href="https://biriderpro.web.app/">BIRIDERPRO</a>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Built With](#built-with)
- [Features](#features)
- [API](#API)
- [Contact](#contact)

### Built With

- Node
- Express
- Mongodb
- cors
- dotenv
- nodemon

## Features

I have implemented crud operation through this node project. Please Look below to see the use of API endpoints of this project. I have used axios in the below example.

## API

<h3 align="center">READ MEHTODS OF CRUD</h3>
<div>
<p>Get all bikes from database</p>
    <code>
        axios.get('https://guarded-sierra-90712.herokuapp.com/bikes').then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get a single bike info from database</p>
    <code>
        axios.get(`https://guarded-sierra-90712.herokuapp.com/bikes/${id}`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get all the user review info from database</p>
    <code>
        axios.get('https://guarded-sierra-90712.herokuapp.com/reviews').then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get all the order info from database</p>
    <code>
        axios.get('https://guarded-sierra-90712.herokuapp.com/orders').then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get a specific user info (is admin or not)</p>
    <code>
        axios.get(`https://guarded-sierra-90712.herokuapp.com/order/${email}`).then((response) => console.log(response.data));
    </code>
</div>

<h3 align="center">CREATE METHODS OF CRUD</h3>
<div>
<p>Create a product in database</p>
    <code>
        axios.post('https://guarded-sierra-90712.herokuapp.com/bikes', orderInfoObject).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Create a review in database</p>
    <code>
        axios.post('https://guarded-sierra-90712.herokuapp.com/bikes', orderInfoObject).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Create an order in database</p>
    <code>
        axios.post('https://guarded-sierra-90712.herokuapp.com/orders', orderInfoObject).then((response) => console.log(response.data));
    </code>
</div>

<h3 align="center">UPDATE MEHTODS OF CRUD</h3>

<div>
<p>Update an order status</p>
    <code>
        axios.put(`https://guarded-sierra-90712.herokuapp.com/order/${id}`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Update an user</p>
    <code>
        axios.put(`https://guarded-sierra-90712.herokuapp.com/users/?email=${user_email)`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Update an user role </p>
    <code>
        axios.put(`https://guarded-sierra-90712.herokuapp.com/users/admin`).then((response) => console.log(response.data));
    </code>
</div>

<h3 align="center">DELETE MEHTODS OF CRUD</h3>
<div>
<p>Delete a product</p>
    <code>
        axios.delete(`https://guarded-sierra-90712.herokuapp.com/bikes/${id}`).then((response) => console.log(response.data));
    </code>
</div>
<div>
<p>Delete an order</p>
    <code>
        axios.delete(`https://guarded-sierra-90712.herokuapp.com/orders/${id}`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Delete many orders</p>
    <code>
        axios.delete(`https://guarded-sierra-90712.herokuapp.com/orders/deleteall/${id}`).then((response) => console.log(response.data));
    </code>
</div>

## Contact

- GitHub [@coder71-bd](https://github.com/coder71-bd)

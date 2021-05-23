/*
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRouter = require('./routes/user');
const buildRouter = require('./routes/build');
const productRouter = require('./routes/product');
*/

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import userRouter from './routes/user.js';
import buildRouter from './routes/build.js';
import productRouter from './routes/product.js';
import newsRouter from './routes/news.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
// noinspection JSCheckFunctionSignatures
app.use(cors());
app.use(express.json());

app.use('/news', newsRouter);
app.use('/build', buildRouter);
app.use('/products', productRouter);
app.use('/user', userRouter);

//mongodb connection
// noinspection JSUnresolvedVariable
const uri = process.env.CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true})
    .then(()=>app.listen(port, ()=> console.log(`Server running in ${port}`)))
    .catch((error)=>console.log(error.message));

// noinspection JSUnresolvedFunction
mongoose.connection.once('open',() => {
    console.log("MongoDB Database Connection Established.")
})
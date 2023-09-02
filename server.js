const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const { authRoutes } = require('./routes');
const app = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const verifyJwt = require('./middlewares/verifyJwt');


app.use(express.json());
app.use(cookieParser());

app.get('/', (req,res) => {
    return res.status(200).json(
        {
            status: 200,
            message: 'Server running'
        }
    )
})

app.use('/api/v1/users', authRoutes);

app.use(verifyJwt);



app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const asyncHandler = require('express-async-handler');

const postUserModel = asyncHandler(async (fields) => {
    const response = await prisma.user.create(
        {
            data : {
                first_name: fields.first_name,
                last_name: fields.last_name,
                contact_no: fields.contact_no,
                email: fields.email,
                password: fields.password,
                image: fields.image,
                role_id: fields.role_id
            }
        }
    )

    await prisma.$disconnect();
    return response;
})

const loginModel = asyncHandler(async(email) => {
    const response = await prisma.user.findFirst(
        {
            where : {
                email
            },
        }
    )

    await prisma.$disconnect();
    return response;
})

const setRefreshToken = asyncHandler(async(email, refresh_token) => {
    const response = await prisma.user.update(
        {
            where : {
                email
            },
            data : {
                refresh_token
            }
        }
    ) 
    await prisma.$disconnect();
    return response;
})

module.exports = {
    postUserModel,
    loginModel,
    setRefreshToken
}
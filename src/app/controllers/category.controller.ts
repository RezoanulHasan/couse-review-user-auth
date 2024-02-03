/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { CategoryModel, validateCategory } from '../modules/category.model';
import { JwtPayload } from 'jsonwebtoken';
//............create-Category.......................
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate request body
    const validatedData = validateCategory(req.body);

    // Extract admin user details from the request
    const adminUser = req.body.user as JwtPayload;

    // Set the createdBy field in validatedData
    validatedData.createdBy = adminUser._id;

    // Create a new category
    const category = await CategoryModel.create(validatedData);

    // Include createdBy details in the success response
    const createdByDetails = {
      _id: adminUser._id,
      name: adminUser.username, // Assuming username is the field you want to use
      email: adminUser.email,
      role: adminUser.role,
    };

    // Send success response
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Category created successfully',
      data: {
        _id: category._id,
        name: category.name,
        createdBy: createdByDetails,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  } catch (err) {
    // Pass the error to the error handling middleware
    next(err);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Retrieve all categories and populate the 'createdBy' field
    const categories = await CategoryModel.find().populate({
      path: 'createdBy',
      select: '_id username email role', // Select the fields you want to include
    });

    // Send success response with the list of categories
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Categories retrieved successfully',
      data: {
        categories: categories.map((category) => ({
          _id: category._id,
          name: category.name,
          createdBy: category.createdBy,

          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        })),
        meta: {},
      },
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

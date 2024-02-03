/* eslint-disable no-undef */
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ReviewModel, validateReview } from '../modules/review.model';
import { CourseModel } from '../modules/course.model';
import { UserModel } from '../modules/user.model';
import config from '../config';

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate the request body
    const validatedData = validateReview(req.body);

    // Extract user information from the JWT token
    const token = req.header('Authorization');

    if (!token) {
      // Handle the case where the 'Authorization' header is not present
      return res.status(401).json({
        success: false,
        message: 'Unauthorized Access',
        errorMessage: 'Missing Authorization header',
        errorDetails: null,
        stack: null,
      });
    }

    const decodedToken = jwt.verify(
      token,
      config.SECRET_KEY as string,
    ) as JwtPayload;

    // Set the createdBy field in validatedData using user information from the token
    validatedData.createdBy = decodedToken._id;

    // Create a new review
    const review = await ReviewModel.create(validatedData);

    // Include createdBy information directly in the review object
    review.createdBy = {
      _id: decodedToken._id,
      username: decodedToken.username,
      email: decodedToken.email,
      role: decodedToken.role,
    };

    // Send a successful response
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Review created successfully',
      data: review,
    });
  } catch (error) {
    // Pass errors to the error handling middleware
    next(error);
  }
};

//.............getCourseWithReviews..............
export const getCourseWithReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courseId = req.params.courseId;

    // Retrieve the course by ID
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Course not found',
      });
    }

    // Retrieve reviews associated with the course
    const reviews = await ReviewModel.find({ courseId });

    // Retrieve the user who created the course
    const createdByUser = await UserModel.findById(
      course.createdBy,
      ' _id username email role  ',
    );

    if (!createdByUser) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'User who created the course not found',
      });
    }

    // Fetch createdByUser information for each review
    const reviewsWithCreatedBy = await Promise.all(
      reviews.map(async (review) => {
        const reviewCreatedByUser = await UserModel.findById(
          review.createdBy,
          '_id username email role ',
        );
        return {
          ...review.toObject(),
          createdBy: reviewCreatedByUser
            ? reviewCreatedByUser.toObject()
            : null,
        };
      }),
    );

    // Create the response object including specific fields from "createdBy"
    const response = {
      success: true,
      statusCode: 200,
      message: 'Course and Reviews retrieved successfully',
      data: {
        course: {
          ...course.toObject(),
          createdBy: createdByUser.toObject(),
        },
        reviews: reviewsWithCreatedBy,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    // Passing errors to the error handler middleware
    next(error);
  }
};

//.................getAllReviews...............
export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Retrieve all reviews from the database
    const reviews = await ReviewModel.find();

    // Check if there are no reviews
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'No reviews found',
      });
    }

    // Fetch createdByUser information for each review
    const reviewsWithCreatedBy = await Promise.all(
      reviews.map(async (review) => {
        const reviewCreatedByUser = await UserModel.findById(
          review.createdBy,
          '_id username email role ',
        );
        return {
          ...review.toObject(),
          createdBy: reviewCreatedByUser
            ? reviewCreatedByUser.toObject()
            : null,
        };
      }),
    );

    // Send a successful response with the array of reviews including createdBy information
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'All reviews retrieved successfully',
      data: reviewsWithCreatedBy,
    });
  } catch (error) {
    // Pass errors to the error handling middleware
    next(error);
  }
};

//-----------------getBestCourse by review........................

export const getBestCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Retrieve courses with statistics
    const coursesWithStats = await CourseModel.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'courseId',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' },
          reviewCount: { $size: '$reviews' },
        },
      },
      {
        $sort: {
          averageRating: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (coursesWithStats.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'No courses found',
      });
    }

    // Retrieve the best course details
    const bestCourse = coursesWithStats[0];

    // Retrieve the user who created the best course
    const createdByUser = await UserModel.findById(
      bestCourse.createdBy,
      '_id username email role createdAt updatedAt',
    );

    if (!createdByUser) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'User who created the best course not found',
      });
    }

    // Extract relevant fields from the best course
    const {
      _id,
      title,
      instructor,
      categoryId,
      price,
      tags,
      startDate,
      endDate,
      language,
      provider,
      durationInWeeks,
      details,
    } = bestCourse;

    const response = {
      success: true,
      statusCode: 200,
      message: 'Best course retrieved successfully',
      data: {
        course: {
          _id,
          title,
          instructor,
          categoryId,
          price,
          tags,
          startDate,
          endDate,
          language,
          provider,
          durationInWeeks,
          details,
        },
        createdBy: createdByUser.toObject(),
        averageRating: bestCourse.averageRating,
        reviewCount: bestCourse.reviewCount,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    // Pass errors to the error handling middleware
    next(error);
  }
};

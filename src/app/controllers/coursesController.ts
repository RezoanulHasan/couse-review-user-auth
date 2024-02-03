/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, NextFunction } from 'express';
import { CourseModel, validateCourse } from '../modules/course.model';
import {
  buildFilter,
  extractSortingParams,
  extractPaginationParams,
} from './helpers';
import { JwtPayload } from 'jsonwebtoken';

//............create-courses........................

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = validateCourse(req.body);

    // Explicitly type startDate and endDate as Date
    const startDate: Date = new Date(validatedData.startDate);
    const endDate: Date = new Date(validatedData.endDate);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const adminUser = req.body.user as JwtPayload;
    const durationInWeeks = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );

    const courseData = {
      ...validatedData,
      durationInWeeks,
      createdBy: adminUser._id,
    };

    const course = await CourseModel.create(courseData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

//............get-courses................

export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy,
      sortOrder = 'asc',
      minPrice,
      maxPrice,
      tags,
      startDate,
      endDate,
      language,
      provider,
      durationInWeeks,
      level,
    } = req.query;

    const { parsedPage, parsedLimit } = extractPaginationParams(page, limit);

    const filter = buildFilter(
      minPrice,
      maxPrice,
      tags,
      startDate as any,
      endDate as any,
      language as any,
      provider as any,
      durationInWeeks as any,
      level as any,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort = extractSortingParams(sortBy as any, sortOrder as any);

    const courses = await CourseModel.find(filter)
      .sort(sort)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .populate({
        path: 'createdBy',
        select: '_id username email role', // Select the fields you want to include
      })
      .exec();

    const total = await CourseModel.countDocuments(filter);

    const response = {
      success: true,
      statusCode: 200,
      message: 'Courses retrieved successfully',
      meta: {
        page: parsedPage,
        limit: parsedLimit,
        total,
      },
      data: { courses: courses },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ..............updateCourse.................

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const courseId = req.params.courseId;

  try {
    // Fetch the existing course and populate the 'createdBy' field
    const existingCourse = await CourseModel.findById(courseId).populate({
      path: 'createdBy',
      select: '_id username email role', // Select the fields you want to include
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Course not found',
      });
    }

    // Update primitive fields
    if (req.body.price) {
      existingCourse.price = req.body.price;
    }

    // Update non-primitive fields
    if (req.body.details && req.body.details.level) {
      existingCourse.details.level = req.body.details.level;
    }

    // Update tags
    if (req.body.tags && req.body.tags.length > 0) {
      req.body.tags.forEach((tag: any) => {
        const existingTagIndex = existingCourse.tags.findIndex(
          (t: { name: any }) => t.name === tag.name,
        );

        if (tag.isDeleted) {
          // Delete the tag if isDeleted is true
          if (existingTagIndex !== -1) {
            existingCourse.tags.splice(existingTagIndex, 1);
          }
        } else {
          // Update or add a new tag
          if (existingTagIndex !== -1) {
            // Update isDeleted for an existing tag
            existingCourse.tags[existingTagIndex].isDeleted = tag.isDeleted;
          } else {
            // Add a new tag
            existingCourse.tags.push({
              name: tag.name,
              isDeleted: tag.isDeleted,
            });
          }
        }
      });
    }

    // Save the updated course
    const updatedCourse = await existingCourse.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};

// ..............get course  by ID.................

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courseId = req.params.id;

    // Fetch the existing course and populate the 'createdBy' field
    const existingCourse = await CourseModel.findById(courseId).populate({
      path: 'createdBy',
      select: '_id username email role', // Select the fields you want to include
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      course: existingCourse,
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

// ..............delete Course  by ID.................

export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await CourseModel.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      res.status(404).json({ message: 'Course not found' });
    } else {
      res
        .status(200)
        .json({ message: 'Course deleted successfully', deletedCourse });
    }
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

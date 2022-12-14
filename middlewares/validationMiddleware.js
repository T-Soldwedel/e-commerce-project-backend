import { check, validationResult } from "express-validator";

export let usersValidation = [
  check("firstName")
    .escape()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Minimum length of first name should be 3 characters"),

  check("lastName")
    .escape()
    .trim()
    .isLength({ max: 20 })
    .withMessage("maximum characters allowed are 20"),

  check("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("please provide us with a valid email."),

  check("password")
    .exists()
    .isLength({ min: 3 })
    .withMessage("Password is too short")
    .isLength({ max: 20 })
    .withMessage("Password is too long"),

  (req,res, next)=> {
    const result = validationResult(req)
    if(result.isEmpty()){
        next()
    } else {

        const error = result.errors.reduce((acc, currentItem)=>{
            acc[currentItem.param]=currentItem.msg
            return acc
        }, {})
        next({message:error})
    }
  }
];

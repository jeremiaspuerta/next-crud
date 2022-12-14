//Subject module
export const INPUT_TEACHER_DATA_EMPTY = "To assign a teacher, you should have to create one first.";

//Payment Module
export const INPUT_SELECT_DATA_EMPTY = (title: string) => `To assign a ${title}, you should have to create one first.`;

//Generic Form
export const REQUIRED_FIELD_ERROR = 'This field is required.';
export const EMAIL_FIELD_ERROR_TEACHER = "Please enter a valid email address with 'teacher' domain.";
export const EMAIL_FIELD_ERROR_PERSON = (entity: string) => `Please enter a valid email address with '${entity}' domain.`; 
export const INPUT_MIN_LENGTH_ERROR = 'Password must be eight or more characters.';
export const TOAST_SUCCESS_TITLE = 'Record created!';
export const TOAST_SUCCESS_UPDATED_TITLE = 'Record updated!';
export const TOAST_ERROR_TITLE = 'We have a little problem.';
export const TOAST_ERROR_DESCRIPTION = 'Please try again later.';
export const TOAST_INFO_DELETE_TITLE = 'Record deleted!';
export const TOAST_SUCCESS_JOIN_ASSIGN_SUBJECT = (subject: string) => `You have joined to ${subject}`;

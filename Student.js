const VALID_COURSES = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

function validateStudent(input, { partial = false } = {}) {
  const errors = [];

  if (!partial || input.name !== undefined) {
    if (input.name === undefined || input.name === null || input.name === '') {
      errors.push('name is required');
    } else {
      const name = String(input.name).trim();
      if (name.length < 2) {
        errors.push('name must be at least 2 characters long');
      }
    }
  }

  if (!partial || input.email !== undefined) {
    if (input.email === undefined || input.email === null || input.email === '') {
      errors.push('email is required');
    } else {
      const email = String(input.email).trim();
      if (!EMAIL_REGEX.test(email)) {
        errors.push('email must be a valid email address');
      }
    }
  }

  if (input.phone !== undefined && input.phone !== null && input.phone !== '') {
    const phone = String(input.phone).trim();
    if (!PHONE_REGEX.test(phone)) {
      errors.push('phone must be exactly 10 digits');
    }
  }

  if (!partial || input.course !== undefined) {
    if (input.course === undefined || input.course === null || input.course === '') {
      errors.push('course is required');
    } else {
      const course = String(input.course).trim();
      if (!VALID_COURSES.includes(course)) {
        errors.push(`course must be one of: ${VALID_COURSES.join(', ')}`);
      }
    }
  }

  return errors;
}

function normalizeStudent(input) {
  return {
    name: String(input.name).trim(),
    email: String(input.email).trim().toLowerCase(),
    phone: input.phone !== undefined && input.phone !== null && input.phone !== ''
      ? String(input.phone).trim()
      : '',
    course: String(input.course).trim(),
  };
}

module.exports = {
  VALID_COURSES,
  validateStudent,
  normalizeStudent,
};

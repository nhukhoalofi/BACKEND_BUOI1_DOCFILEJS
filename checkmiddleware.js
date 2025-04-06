export function checkID(req, res, next) {
  let id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid ID' });
  }
  next();
}
export function validateUserInput(req, res, next){
  const { id, name, age } = req.body;
  const errors = [];

  if (id !== undefined) {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      errors.push('ID không hợp lệ');
    }
  }

  if (!name || typeof name !== 'string') {
    errors.push('Name không hợp lệ');
  }
  if (age === undefined || typeof age !== 'number' || isNaN(age)) {
    errors.push('Tuổi không hợp lệ');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
/*Ici je vais rassembler mes functions pour gérer mes erreurs et 
avoir un message de réponse approprié*/

module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.message.includes("pseudo")) {
    errors.pseudo = "Le pseudo est incorrect ou déjà utilisé";
  }

  if (err.message.includes("email")) {
    errors.email = "L'adresse email est incorrecte";
  }

  if (err.message.includes("password")) {
    errors.password = "Le mot de passe doit faire au moins 6 caractères";
  }

  if (err.code === 11000 && Object.keys(err.keyValue)[0] === "pseudo") {
    errors.pseudo = "Ce pseudo est déjà utilisé";
  }

  if (err.code === 11000 && Object.keys(err.keyValue)[0] === "email") {
    errors.email = "Cette adresse email est déjà utilisée";
  }

  return errors;
};

module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email")) {
    errors.email = "L'adresse email est inconnue ou incorrecte";
  }

  if (err.message.includes("password")) {
    errors.password = "Le mot de passe ne correspond pas ";
  }

  return errors;
};

module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" };

  if (err.message.includes("Invalid file type")) {
    errors.format =
      "Le fichier téléchargé n'est pas un format d'image valide (JPG, PNG ou JPEG)";
  }

  if (err.message.includes("File size exceeded maximum limit")) {
    errors.maxSize =
      "La taille du fichier téléchargé dépasse la limite maximale de 500KB";
  }

  return errors;
};

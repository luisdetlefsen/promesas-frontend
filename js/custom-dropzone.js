
 // Dropzone.autoDiscover = false;
  Dropzone.options.myAwesomeDropzone = {
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 2, // MB
    dictDefaultMessage: "Sube fotos, grabaciones, videos, o documentos ",
    accept: function (file, done) {
      if (file.name == "justinbieber.jpg") {
        done("Naha, you don't.");
      }
      else { done(); }
    }
  };

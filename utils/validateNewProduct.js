export default function validateNewAccount(values) {
    let errors = {};
    if(!values.name) {
        errors.name = 'El nombre es obligatorio';
    }
    if(!values.company) {
        errors.company = 'El nombre de empresa es obligatoria';
    } 
    if(!values.url) {
        errors.url = 'La URL es obligatoria';
    } else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
        errors.url = 'La URL no es válida';
    }
    if(!values.description) {
        errors.description = 'Añade una descripción de tu producto';
    }
    return errors;
}
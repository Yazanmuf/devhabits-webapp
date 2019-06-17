export default function validateCreateLink(values) {
    let errors = {};

    // Description Errors
    if (!values.description) {
        errors.description = "Description Required";
    } else if (values.description.length < 10) {
        errors.description = "description must be at least 10 characters";
    }
    // Resource Errors
    if (!values.resource) {
        errors.resource = "Resource Required";
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.resource)) {
        errors.resource = "Must be a valid URL";
    }

    return errors;
}

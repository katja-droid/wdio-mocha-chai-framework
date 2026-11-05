const required = (name) => {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
};

export const testData = {
    credentials: {
        email: required('TEST_EMAIL'),
        password: required('TEST_PASSWORD')
    },
    searchTerm: required('SEARCH_TERM'),
    sortOption: required('SORT_OPTION'),
    address: {
        state: required('ADDRESS_STATE'),
        postalCode: required('ADDRESS_POSTAL_CODE'),
        houseNumber: required('ADDRESS_HOUSE_NUMBER'),
        country: required('ADDRESS_COUNTRY')
    },
    paymentMethod: required('PAYMENT_METHOD')
};
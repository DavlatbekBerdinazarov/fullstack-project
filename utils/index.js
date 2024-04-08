module.exports = {
    ifequal: function(a, b, options) {
        if (a == b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },

    getFullNameUser: function(firstname, lastname) {
        if (!firstname || !lastname) {
            return "AS"; // Or handle as needed
        }
        return firstname.charAt(0) + " " + lastname.charAt(0);
    }
    
};



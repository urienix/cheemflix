// handlebars helpers
export const helpers = {
    notRender: (options) => {
        return options.inverse(this);
    },

    ifCond: (v1, operator, v2, options) => {
        return eval(`'${v1}' ${operator} '${v2}'`) ? options.fn(this) : options.inverse(this);
    }
};
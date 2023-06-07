// handlebars helpers
export const helpers = {
    notRender: (options) => {
        return options.inverse(this);
    }
};
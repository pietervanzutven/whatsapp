function require(input) {
    'use strict';

    if (typeof input === 'string') {
        let script;
        if (input.includes('.')) {
            const err = new Error();
            const stack = err.stack.split('\n')[2];
            const start = stack.lastIndexOf('ms-appx:');
            const end = stack.lastIndexOf('.js');
            const path = stack.substring(start, end);
            const parts = path.split('/');
            parts.pop();
            const uri = Windows.Foundation.Uri(parts.join('/') + '/' + input);
            script = uri.absoluteUri.toLowerCase();
        } else {
            script = ('ms-appx://whatsapp/js/node_modules/' + input).toLowerCase();
        }

        if (require.modules[script]) {
            return require.modules[script].exports;
        } else if (require.scripts[script]) {
            const module = { exports: {} };
            require.modules[script] = module;
            require.scripts[script](module.exports, module);
            return module.exports;
        } else if (require.scripts[script + '/index']) {
            const module = { exports: {} };
            require.modules[script + '/index'] = module;
            require.scripts[script + '/index'](module.exports, module);
            return module.exports;
        } else {
            console.log(script);
            throw script;
        }
    } else {
        const err = new Error();
        const stack = err.stack;
        const start = stack.lastIndexOf('ms-appx:');
        const end = stack.lastIndexOf('.js');
        const script = stack.substring(start, end).toLowerCase();
        require.scripts[script] = input;
    }
}
require.scripts = {};
require.modules = {};
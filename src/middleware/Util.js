const Util = {
    Fetch: (options) => {
        if (!options) { return; }
        if (options.args === undefined) {
            options.args = null;
        }
        // default request options
        let defaultOps = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            url: 'http://wx.bo.sogou.com',
            body: options.json ? options.args : JSON.stringify(options.args)
        };

        let finalOps = {
            method: options.method || defaultOps.method,
            headers: options.headers || defaultOps.headers,
            credentials: options.credentials || defaultOps.credentials
        };
        if (options.method === 'GET'){
            let urlArgs = Object.keys(options.args).map(function(key){
                return encodeURIComponent(key) + '=' + encodeURIComponent(options.args[key]);
            }).join('&');
            finalOps.url = options.url + '?' + urlArgs
        }else{
            finalOps.url = options.url || defaultOps.url;
            finalOps.body = options.body || defaultOps.body;
        }

        let url = finalOps.url;
        let req = options.req || new Request(url, finalOps);

        console.log(url, options.args);

        return fetch(req)
            .then(response => response.json())
            .then(responseData => {
                console.log(responseData)
                if (responseData.success) {
                    options.success && options.success(responseData);
                    return responseData;
                } else {
                    options.fail && options.fail(responseData);
                    return  Promise.reject(responseData)
                }
            }).catch(err => console.log(err));
    }
}
export default Util;
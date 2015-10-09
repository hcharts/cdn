var app = new Vue({
    el: '#app',
    data: {
        devDependencies: [],
        active: {
            name: null,
            main: [],
            description: null,
            homepage: null,
            license: null,
            version: null
        },
        s: null,
        searchResult: [],
        searchResultShow: 'none'
    },
    methods: {
        showDetail: function(name, version) {
            var self = this;
            $.getJSON('../bower_components/' + name + '/bower.json', function(data) {
                self.active.main = [];
                self.active.name = name;
                self.s = name;

                if (typeof data.main === "string") {
                    self.active.main.push(data.main)
                } else {
                    self.active.main = data.main;
                }
                self.active.version = version.replace('~', '');
                self.active.description = data.description;
                self.active.homepage = data.homepage;
                self.active.license = data.license;
            });
        },
        select: function(name, version) {
            this.showDetail(name, version);
            if (this.searchResultShow === 'block') {
                this.searchResultShow = 'none';
            }
        },
        inputBlur: function() {
            setTimeout(function() {
                this.searchResultShow = 'none';
            }, 500);
        },

        checkUpdate: function() {
            var $btn = $('#checkUpdate').button('loading');
            var self = this;
            $.ajax({
                url: 'index.php',
                type: 'post',
                data: {
                    name: self.active.name,
                    version: self.active.version,
                    action: 'checkupdate'
                },
                // dataType: 'json',
                success: function(data) {
                    $btn.button('reset');
                }
            });

            //$btn.button('reset')
        },
        search: function() {
            // var self = this;
            // var fined = _.find(this.devDependencies, function(v, k) {
            //     return k === self.s;
            // });

            // if(fined) {
            //     this.active = fined;
            // }
        }
    }
});

$.getJSON('../bower.json', function(data) {
    app.devDependencies = data.devDependencies;
    var temp = [];
    _.each(data.devDependencies, function(v, k) {
        var t = {};
        t.name = k;
        t.version = v;
        // t.version = v.replace('~', '');
        t.install = true;
        temp.push(t);
    });
    app.searchResult = temp;
    setTimeout(function() {
        jQuery(".installed").find('li')[0].click();
    }, 500);
});
